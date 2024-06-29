// dependencies
const {
  unauthorized,
  forbidden,
  conflict,
  notFound,
  badData,
  internal,
} = require("@hapi/boom");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// esentials
const secrets = require("../../configs/jwt.configs");
const prisma = require("../../connections/prisma.connection");
const SharedController = require("../Shared/controller");
const {
  SignAccessToken,
  SignRefreshToken,
  SignChangePasswordToken,
  DecodeChangePasswordToken,
} = require("../../utils/JWT/jwt.functions");
const {
  AccessTokenPayload,
  RefreshTokenPayload,
  PasswordChangeTokenPayload,
} = require("../Shared/utils/jwt.payloads");
const {
  WhereId,
  WhereUserId,
  WhereName,
} = require("../Shared/utils/prisma.objects");
const { IncludeUserData } = require("./utils/prisma.objects");
const { CreateEmployee } = require("../User/utils/prisma.objects");
const {
  encryptSymmetric,
  decryptSymmetric,
  transformToBase64,
  revertFromBase64,
} = require("../../utils/encrypt.functions");
const { sendMail } = require("../../utils/mailer.functions");
const RESPONSE_MESSAGES = require("../../responses/response.messages");

// utils
const { allowed } = require("./utils/has.permissions");
const {
  isoTimeByAttempts,
  compareDates,
  setMinutesISOTime,
} = require("../../utils/set.time");
const { randomId, randomCode } = require("../../utils/random.id");
const {
  PasswordRecoveryTemplate,
} = require("../../templates/password.recovery");
const { ConfirmEmailTemplate } = require("../../templates/confirm.email");

class AuthController extends SharedController {
  async tokenPair(data) {
    const { sub, uid } = data;

    const user = await prisma.users.findUnique({
      ...WhereId(uid),
      ...IncludeUserData,
    });
    if (!user) throw new unauthorized(RESPONSE_MESSAGES.USER_NOT_FOUND);

    const blacklisted = await prisma.blacklistedSessions.findUnique(
      WhereId(sub)
    );

    if (blacklisted) {
      prisma.$transaction(async (tx) => {
        const sessions = await tx.activeSessions.findMany(WhereUserId(uid));

        await tx.blacklistedSessions.createMany({
          data: [...sessions.map((s) => ({ id: s.id, userId: s.userId }))],
        });

        await tx.activeSessions.deleteMany(WhereUserId(uid));
      });

      throw new forbidden("Log in again");
    }

    const rId = crypto.randomUUID();

    prisma.$transaction(async (tx) => {
      await tx.activeSessions.update({
        ...WhereId(sub),
        data: {
          id: rId,
        },
      });

      await tx.blacklistedSessions.create({
        data: {
          id: sub,
          userId: uid,
          isExpired: true,
        },
      });
    });

    const AccessToken = SignAccessToken(AccessTokenPayload(user));
    const RefreshToken = SignRefreshToken(RefreshTokenPayload(user, rId));

    return {
      AccessToken,
      RefreshToken,
    };
  }

  async activeSessions(user) {
    const existsUser = await prisma.users.findUnique(WhereId(user.uid));
    if (!existsUser) throw new notFound(RESPONSE_MESSAGES.USER_NOT_FOUND);

    const permissions = await this.getRolePermissions(user.role[0]);

    const allowedTo = allowed(permissions, "READ_OWN_SESSIONS");
    if (!allowedTo)
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    const s = await prisma.activeSessions.findMany(WhereUserId(user.uid));

    return s;
  }

  async blacklistedSessions(user) {
    const existsUser = await prisma.users.findUnique(WhereId(user.uid));
    if (!existsUser) throw new notFound(RESPONSE_MESSAGES.USER_NOT_FOUND);

    const permissions = await this.getRolePermissions(user.role[0]);

    const allowedTo = allowed(permissions, "READ_OWN_BLACKLISTED_SESSIONS");
    if (!allowedTo)
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    const s = await prisma.blacklistedSessions.findMany(WhereUserId(user.uid));

    return s;
  }

  async login(data) {
    const { email, password } = data;

    const user = await this.getByEmail(email);
    if (!user)
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_CREDENTIALS);

    if (user.auth.timeToLoginAgain && !compareDates(user.auth.timeToLoginAgain))
      throw new unauthorized(
        `You need to wait until ${user.auth.timeToLoginAgain} to perform a login again`
      );

    const comparePasswords = await bcrypt.compare(password, user.auth.password);

    if (!comparePasswords) {
      const totalAttempts = user.auth.loginAttempts;
      await prisma.auth.update({
        ...WhereId(user.auth.id),
        data: {
          loginAttempts: {
            increment: 1,
          },
          timeToLoginAgain:
            totalAttempts >= 5 ? isoTimeByAttempts(totalAttempts) : undefined,
        },
      });

      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_CREDENTIALS);
    }

    const rId = crypto.randomUUID();

    prisma.$transaction(async (tx) => {
      await tx.auth.update({
        ...WhereId(user.auth.id),
        data: {
          loginAttempts: 0,
          timeToLoginAgain: null,
        },
      });

      await tx.activeSessions.create({
        data: {
          id: rId,
          userId: user.id,
        },
      });
    });

    return {
      AccessToken: SignAccessToken(AccessTokenPayload(user)),
      RefreshToken: SignRefreshToken(RefreshTokenPayload(user, rId)),
    };
  }

  async updateUserRole(user, data) {
    const { roleId, userId } = data;

    const transaction = await prisma.$transaction(async (tx) => {
      const _exist = await tx.users.findUnique(WhereId(user.uid));
      if (!_exist)
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_PERMISSION);

      const _permissions = await this.getRolePermissions(user.role[0]);
      if (_permissions && !_permissions.length)
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_PERMISSION);

      const _user = await prisma.users.findUnique(WhereId(userId));
      if (!_user)
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_PERMISSION);

      const _role = await tx.roles.findUnique(WhereId(roleId));
      if (!_role) throw new unauthorized(RESPONSE_MESSAGES.ROLE_NOT_FOUND);

      if (!allowed(_permissions, `ASSIGN_${_role.name}_ROLE`))
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_PERMISSION);

      if (_role.name.toUpperCase() === "OWNER")
        throw new forbidden("You cannot give the owner role");

      tx.auth.update({
        ...WhereId(_user.auth.id),
        data: {
          roleId: _role.id,
        },
      });

      const _activeSessions = await tx.activeSessions.findMany(
        WhereUserId(userId)
      );

      tx.blacklistedSessions.createMany({
        data: [
          ..._activeSessions.map((aS) => ({
            id: aS.id,
            userId: aS.userId,
            isExpired: true,
          })),
        ],
      });

      tx.activeSessions.deleteMany(WhereUserId(userId));
    });

    return {
      message: "Role updated successfully",
    };
  }

  async closeActiveSession(user, userId, sessionId) {
    const exists = await prisma.users.findUnique(WhereId(userId));
    if (!exists) throw new notFound(RESPONSE_MESSAGES.USER_NOT_FOUND);

    await prisma.$transaction(async (tx) => {
      const _permissions = await this.getRolePermissions(user.role[0]);
      if (_permissions && !_permissions.length)
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ROLE);

      const _session = await tx.activeSessions.findUnique(WhereId(sessionId));
      if (!_session) throw new notFound("Session already closed");

      const canDelete = allowed(_permissions, "DELETE_SESSIONS");
      if (user.uid !== userId && !canDelete)
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

      const ownDelete = allowed(_permissions, "DELETE_OWN_SESSIONS");
      if (user.uid === userId && !ownDelete)
        throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

      tx.blacklistedSessions.create({
        data: {
          id: _session.id,
          hasLogout: true,
          isExpired: false,
          userId: _session.userId,
        },
      });

      await tx.activeSessions.delete(WhereId(_session.id));
    });

    return {
      message: "Session closed successfully",
    };
  }

  async requestPasswordChange(email) {
    const user = await this.getByEmail(email);
    if (!user)
      return {
        message: "Verification email has been sent",
      };

    const time = user.auth.timeToRequestPasswordRecovery;
    if (time && !compareDates(time))
      throw new unauthorized(
        RESPONSE_MESSAGES.UNAUTHORIZED_REQUEST_PASSWORD_RESET
      );

    const code = crypto.randomInt(1000000, 9999999);
    const tokenId = crypto.randomUUID();

    const str = JSON.stringify({
      authId: user.auth.id,
      code: code,
      tokenId: tokenId,
      expires: setMinutesISOTime(30),
      action: "RECOVER_PASSWORD",
    });

    const { ciphertext, iv, tag } = encryptSymmetric(
      secrets.CHANGE_PASSWORD_TOKEN_SECRET,
      str
    );

    const toSendLink = transformToBase64(ciphertext, {
      authId: user.auth.id,
      tid: tokenId,
    });

    const attempts = user.auth.passwordRecoveryAttempts + 1;

    const transaction = await prisma.$transaction(async (tx) => {
      await tx.authRecovery.create({
        data: {
          id: tokenId,
          iv: iv,
          tag: tag,
          code: code,
          authId: user.auth.id,
          valid: true,
          requestedAt: new Date().toISOString(),
        },
      });

      await tx.auth.update({
        ...WhereId(user.auth.id),
        data: {
          passwordRecoveryAttempts: {
            increment: 1,
          },
          timeToRequestPasswordRecovery:
            attempts >= 5 ? isoTimeByAttempts(attempts) : undefined,
        },
      });

      return null;
    });

    await sendMail(email, {
      subject: "Recover your password",
      text: "Password recovery request",
      html: PasswordRecoveryTemplate(toSendLink),
    });

    return {
      message: "Verification email has been sent",
    };
  }

  async validateChangeToken(token) {
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

    const rec = await prisma.authRecovery.findUnique(WhereId(obj.tid));
    if (!rec) throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    if (!rec.valid)
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_SESSION);

    if (rec.changeAttempts >= 5) {
      await prisma.authRecovery.update({
        ...WhereId(rec.id),
        data: { valid: false },
      });

      throw new unauthorized("Please request another password change");
    }

    const decrypt = JSON.parse(
      decryptSymmetric(
        secrets.CHANGE_PASSWORD_TOKEN_SECRET,
        obj.__ciphertext__,
        rec.iv,
        rec.tag
      )
    );

    if (decrypt.tokenId !== rec.id)
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    if (decrypt.authId !== user.auth.id)
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    if (decrypt.code !== rec.code) throw new unauthorized("Invalid code");

    if (decrypt.action !== "RECOVER_PASSWORD")
      throw new unauthorized("This token its invalid for this action");

    if (!compareDates(decrypt.expires))
      throw new unauthorized("Token lifetime expired");

    const AuthorizePasswordChangeToken = SignChangePasswordToken(
      PasswordChangeTokenPayload(user, rec.id)
    );

    await prisma.authRecovery.update({
      ...WhereId(decrypt.tokenId),
      data: {
        changeAttempts: {
          increment: 1,
        },
      },
    });

    return {
      token: AuthorizePasswordChangeToken,
    };
  }

  async changePassword(data, password) {
    const rec = await prisma.authRecovery.findUnique(WhereId(data.rid));
    if (!rec.valid)
      throw new unauthorized("Please request another password change");

    const user = await prisma.users.findUnique({
      ...WhereId(data.uid),
      ...IncludeUserData,
    });
    if (!user) throw new unauthorized(RESPONSE_MESSAGES.USER_NOT_FOUND);

    await prisma.$transaction(async (tx) => {
      const hash = await bcrypt.hash(password, 10);

      const _auth = await tx.auth.update({
        ...WhereId(user.auth.id),
        data: {
          password: hash,
        },
      });

      const _rec = await tx.authRecovery.update({
        ...WhereId(rec.id),
        data: {
          valid: false,
        },
      });

      return true;
    });

    return {
      message: "Changed Successfully",
    };
  }
}

module.exports = new AuthController();
