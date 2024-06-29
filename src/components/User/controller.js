// dependencies
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {
  unauthorized,
  forbidden,
  notFound,
  conflict,
  badData,
} = require("@hapi/boom");

// esentials
const prisma = require("../../connections/prisma.connection");
const secrets = require("../../configs/jwt.configs");
const SharedController = require("../Shared/controller");
const { CreateCustomer, CreateEmployee } = require("./utils/prisma.objects");
const {
  WhereId,
  WhereName,
  WhereUserId,
} = require("../Shared/utils/prisma.objects");
const { IncludeUserData } = require("../Auth/utils/prisma.objects");
const {
  SignAccessToken,
  SignRefreshToken,
} = require("../../utils/JWT/jwt.functions");
const {
  AccessTokenPayload,
  RefreshTokenPayload,
} = require("../Shared/utils/jwt.payloads");
const {
  encryptSymmetric,
  decryptSymmetric,
  revertFromBase64,
  transformToBase64,
} = require("../../utils/encrypt.functions");
const { sendMail } = require("../../utils/mailer.functions");
const RESPONSE_MESSAGES = require("../../responses/response.messages");

// utils
const { compareDates, setMinutesISOTime } = require("../../utils/set.time");
const { allowed } = require("../Auth/utils/has.permissions");
const { ConfirmEmailTemplate } = require("../../templates/confirm.email");

class UserController extends SharedController {
  async createCustomer(data) {
    const { email, password } = data;

    const taken = await this.getByEmail(email);
    if (taken) throw new conflict("Email already taken");

    const rId = crypto.randomUUID();

    const user = await prisma.$transaction(async (tx) => {
      const _role = await tx.roles.findFirst(WhereName("CUSTOMER"));
      if (!_role) throw new badData(RESPONSE_MESSAGES.ROLE_NOT_FOUND);

      const hash = await bcrypt.hash(password, 10);
      const obj = { ...data, password: hash, roleId: _role.id, rId };

      const _user = await tx.users.create(CreateCustomer(obj));
      return _user;
    });

    this.requestConfirmUserEmail(email);

    return {
      AccessToken: SignAccessToken(AccessTokenPayload(user)),
      RefreshToken: SignRefreshToken(RefreshTokenPayload(user, rId)),
    };
  }

  async addEmployee(user, data) {
    const { email, password, roleId } = data;

    const taken = await this.getByEmail(email);
    if (taken) throw new conflict("Email already taken");

    const transaction = await prisma.$transaction(async (tx) => {
      const _validUser = await tx.users.findUnique({
        ...WhereId(user.uid),
        ...IncludeUserData,
      });
      if (!_validUser)
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_PERMISSION);

      const _role = await tx.roles.findUnique(WhereId(roleId));
      if (!_role) throw new unauthorized(RESPONSE_MESSAGES.ROLE_NOT_FOUND);

      const _permissions = await this.getRolePermissions(
        _validUser.auth.role.name
      );
      if (!_permissions.length)
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_PERMISSION);

      if (
        _validUser.auth.role.name.toUpperCase() === "OWNER" &&
        _role.name.toUpperCase() === "OWNER"
      )
        throw new forbidden("You cannot give the owner role");

      if (!allowed(_permissions, `CREATE_${_role.name}`))
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_PERMISSION);

      const _hash = await bcrypt.hash(password, 10);

      const _obj = { ...data, password: _hash, roleId: _role.id };
      const _user = await tx.users.create(CreateEmployee(_obj));

      return _user;
    });

    this.requestConfirmUserEmail(email);

    return {
      message: "Created successfully",
    };
  }

  async requestConfirmUserEmail(email) {
    const user = await this.getByEmail(email);
    if (!user) throw new notFound(RESPONSE_MESSAGES.USER_NOT_FOUND);

    const time = user.auth.timeToRequestConfirm;
    if (time && !compareDates(time))
      throw new unauthorized(
        RESPONSE_MESSAGES.FORBIDDEN_REQUEST_PASSWORD_RESET
      );

    const attempts = user.auth.requestConfirmAttempts + 1;

    const object = {
      authId: user.auth.id,
      tokenId: crypto.randomUUID(),
      expires: setMinutesISOTime(30),
      action: "CONFIRM_EMAIL",
    };

    const { ciphertext, iv, tag } = encryptSymmetric(
      secrets.CONFIRM_AUTH_USER_SECRET,
      JSON.stringify(object)
    );
    5;
    const toSend = transformToBase64(ciphertext, {
      authId: user.auth.id,
      tid: object.tokenId,
    });

    sendMail(email, {
      subject: "Confirm your email",
      text: "Confirm your email",
      html: ConfirmEmailTemplate(toSend),
    });

    prisma.$transaction(async (tx) => {
      await tx.authConfirm.create({
        data: {
          id: object.tokenId,
          iv,
          tag,
          authId: user.auth.id,
          requestedAt: new Date().toISOString(),
        },
      });

      await tx.auth.update({
        ...WhereId(user.auth.id),
        data: {
          requestConfirmAttempts: { increment: 1 },
          timeToRequestConfirm:
            attempts >= 5 ? isoTimeByAttempts(attempts) : undefined,
        },
      });

      return true;
    });

    return {
      message: "Email has been sent",
    };
  }

  async confirmUser(token) {
    const obj = revertFromBase64(token);

    if (typeof obj !== "object")
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    if (
      (obj && !obj.__ciphertext__) ||
      (obj && !obj.authId) ||
      (obj && !obj.tid)
    )
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    const user = await prisma.users.findFirst({
      where: { auth: { id: obj.authId } },
      ...IncludeUserData,
    });
    if (!user) throw new notFound(RESPONSE_MESSAGES.USER_NOT_FOUND);

    const confirm = await prisma.authConfirm.findUnique(WhereId(obj.tid));
    if (!confirm) throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    const decrypt = JSON.parse(
      decryptSymmetric(
        secrets.CONFIRM_AUTH_USER_SECRET,
        obj.__ciphertext__,
        confirm.iv,
        confirm.tag
      )
    );
    if (!decrypt) throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    if (decrypt.tokenId !== confirm.id)
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    if (decrypt.authId !== user.auth.id)
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    if (decrypt.action !== "CONFIRM_EMAIL")
      throw new unauthorized("This token its invalid for this action");

    if (decrypt && decrypt.expires && !compareDates(decrypt.expires))
      throw new unauthorized("Token lifetime expired");

    prisma.$transaction(async (tx) => {
      await tx.authConfirm.deleteMany({ where: { authId: user.auth.id } });

      await tx.auth.update({
        ...WhereId(user.auth.id),
        data: {
          confirmed: true,
        },
      });
    });

    return {
      message: "User confirmed successfully",
    };
  }

  async updateUserInfo(user, data) {
    const { firstName, lastName, address, birthDate } = data;

    const existsUser = await this.getUserById(user, user.uid);

    const updateData = await prisma.$transaction(async (tx) => {
      const _permissions = await this.getRolePermissions(user.role[0]);
      if (!_permissions)
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ROLE);

      if (!allowed(_permissions, "UPDATE_OWN_USER"))
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

      const _user = await tx.profile.update({
        ...WhereId(existsUser.profile.id),
        data: {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          birthDate: birthDate || undefined,
          address: address || undefined,
        },
      });

      return true;
    });

    return {
      message: "Updated successfully",
    };
  }

  async updateCoverImage(user, { filename, destination }) {
    const exists = await prisma.users.findUnique({
      ...WhereId(user.uid),
      ...IncludeUserData,
    });
    if (!exists) throw new notFound(RESPONSE_MESSAGES.USER_NOT_FOUND);

    await prisma.$transaction(async (tx) => {
      const _updated = await tx.profile.update({
        ...WhereId(exists.profile.id),
        data: {
          CoverImage: {
            create: {
              id: filename,
              uri: destination,
            },
          },
        },
      });

      return _updated;
    });

    return {
      message: "Updated Successfully",
    };
  }

  async updateEmail(user, userId, newEmail) {
    const findUser = await prisma.users.findUnique({
      ...WhereId(user.uid),
      ...IncludeUserData,
    });
    if (!findUser) throw new notFound(RESPONSE_MESSAGES.USER_NOT_FOUND);

    const transaction = await prisma.$transaction(async (tx) => {
      const _email = await this.getByEmail(newEmail);
      if (_email) throw new conflict("Email already taken");

      const _permissions = await this.getRolePermissions(user.role[0]);
      if (!_permissions)
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ROLE);

      const _user =
        userId === user.uid
          ? { ...findUser }
          : await prisma.users.findUnique({
              ...WhereId(userId),
              ...IncludeUserData,
            });

      // if (_user.id === user.uid && !allowed(_permissions, "UPDATE_OWN_USER"))
      // throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_PERMISSION);

      if (
        _user.id !== user.uid &&
        !allowed(_permissions, `UPDATE_${_user.auth.role.name}_USER`)
      )
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_PERMISSION);

      await tx.auth.update({
        ...WhereId(_user.auth.id),
        data: {
          email: newEmail,
        },
      });

      const sessions = await tx.activeSessions.findMany({
        where: { userId: _user.id },
      });

      await tx.blacklistedSessions.createMany({
        data: [
          ...sessions.map((s) => ({
            id: s.id,
            userId: s.userId,
            hasLogout: true,
            isExpired: true,
          })),
        ],
        skipDuplicates: true,
      });

      await tx.activeSessions.deleteMany(WhereUserId(_user.id));

      return true;
    });

    return {
      message: "Email updated successfully",
    };
  }

  async updatePassword(user, userId, oldPassword, newPassword) {
    const findUser = await prisma.users.findUnique({
      ...WhereId(user.uid),
      ...IncludeUserData,
    });
    if (!findUser) throw new notFound(RESPONSE_MESSAGES.USER_NOT_FOUND);

    await prisma.$transaction(async (tx) => {
      // we verify user permissions
      const _permissions = await this.getRolePermissions(user.role[0]);
      if (!_permissions)
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ROLE);

      // if its the same user we dont need to do anything, if not, we fetch the user
      const _user =
        userId === user.uid
          ? { ...findUser }
          : await prisma.users.findUnique({
              ...WhereId(userId),
              ...IncludeUserData,
            });

      // if owner user does not have the correct permission throws an error
      if (_user.id === user.uid && !allowed(_permissions, "UPDATE_OWN_USER"))
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_PERMISSION);

      // if user requesting its not the same and does not have the correct permission we throws an error
      if (
        _user.id !== user.uid &&
        !allowed(_permissions, `UPDATE_${_user.auth.role.name}_USER`)
      )
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_PERMISSION);

      const hash = await bcrypt.hash(newPassword, 10);

      // if an admin tries to update any user password due to any problem, he could do that without any problems
      if (!oldPassword && _user.id !== user.uid) {
        await tx.auth.update({
          ...WhereId(_user.auth.id),
          data: {
            password: hash,
          },
        });

        return true;
      }

      const compare = await bcrypt.compare(oldPassword, _user.auth.password);
      if (!compare)
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_CREDENTIALS);

      if (compare && newPassword === oldPassword) return true;

      await tx.auth.update({
        ...WhereId(_user.auth.id),
        data: {
          password: hash,
        },
      });

      const sessions = await tx.activeSessions.findMany(WhereUserId(_user.id));

      await tx.blacklistedSessions.createMany({
        data: [
          ...sessions.map((s) => ({
            id: s.id,
            userId: s.userId,
            hasLogout: true,
            isExpired: true,
          })),
        ],
        skipDuplicates: true,
      });

      await tx.activeSessions.deleteMany(WhereUserId(_user.id));

      return true;
    });

    return {
      message: "Password updated successfully",
    };
  }

  async deleteUser(user, userId) {
    const exists = await this.getUserById(user, userId);
    if (!exists) throw new notFound(RESPONSE_MESSAGES.USER_NOT_FOUND);

    const _permissions = await this.getRolePermissions(user.role[0]);
    if (!_permissions)
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ROLE);

    if (user.uid === userId && !allowed(_permissions, "DELETE_OWN_USER"))
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    if (
      user.uid !== userId &&
      !allowed(_permissions, `DELETE_${exists.auth.role.name}_USER`)
    )
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    prisma.$transaction([
      prisma.authConfirm.deleteMany({ where: { authId: exists.auth.id } }),
      prisma.authRecovery.deleteMany({ where: { authId: exists.auth.id } }),
      prisma.activeSessions.deleteMany(WhereUserId(exists.id)),
      prisma.blacklistedSessions.deleteMany(WhereUserId(exists.id)),
      prisma.profile.delete(WhereUserId(exists.id)),
      prisma.auth.delete(WhereUserId(exists.id)),
      prisma.users.delete(WhereId(exists.id)),
    ]);

    return {
      message: "Deleted Successfully",
    };
  }
}

module.exports = new UserController();
