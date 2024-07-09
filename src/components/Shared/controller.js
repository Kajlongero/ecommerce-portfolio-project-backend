// dependencies
const { unauthorized, badData } = require("@hapi/boom");

// esentials
const prisma = require("../../connections/prisma.connection");
const { WhereId, WhereName } = require("./utils/prisma.objects");
const { IncludeUserData } = require("../Auth/utils/prisma.objects");
const { SelectUserInfo } = require("../User/utils/prisma.objects");
const RESPONSE_MESSAGES = require("../../responses/response.messages");

// utils
const { allowed } = require("../Auth/utils/has.permissions");

class SharedController {
  async getUserById(user, id, permissions = undefined) {
    if (typeof id !== "string") throw new badData();

    const userData = await prisma.users.findUnique({
      ...WhereId(id),
      ...IncludeUserData,
    });
    if (!userData) throw new notFound(RESPONSE_MESSAGES.USER_NOT_FOUND);

    const p = permissions
      ? permissions
      : await this.getRolePermissions(user.role[0]);

    const ownRead = allowed(p, "READ_OWN_USER_INFO");
    if (user.uid === id && ownRead) return userData;

    const canRead = allowed(p, `READ_${userData.auth.role.name}_INFO`);
    if (user.uid !== id && canRead) return userData;

    throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_PERMISSION);
  }

  async getUserInfo(user, id, permissions = undefined) {
    if (typeof id !== "string") throw new badData();

    const userData = await prisma.users.findUnique({
      ...WhereId(id),
      ...SelectUserInfo,
    });
    if (!userData) throw new notFound(RESPONSE_MESSAGES.USER_NOT_FOUND);

    const p = permissions
      ? permissions
      : await this.getRolePermissions(user.role[0]);

    const ownRead = allowed(p, "READ_OWN_USER_INFO");
    if (user.uid === id && ownRead) return userData;

    const canRead = allowed(p, `READ_${userData.auth.role.name}_INFO`);
    if (user.uid !== id && canRead) return userData;

    throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_PERMISSION);
  }

  async getRolePermissions(name) {
    if (typeof name !== "string") throw new badData();

    const permissions = await prisma.$transaction(async (tx) => {
      const _role = await tx.roles.findFirst(WhereName(name));
      if (!_role) throw new badData(RESPONSE_MESSAGES.ROLE_NOT_FOUND);

      const _permissions = await tx.permissions.findMany({
        where: {
          roles: {
            some: {
              id: _role.id,
            },
          },
        },
      });

      return _permissions;
    });

    return [...permissions.map((p) => p.name)];
  }

  async getByEmail(email) {
    const user = await prisma.users.findFirst({
      where: { auth: { email: email } },
      ...IncludeUserData,
    });

    return user;
  }

  async getPermissionsAndValidate(user, permissionExpected) {
    const existsUser = await prisma.users.findUnique(WhereId(user.uid));
    if (!existsUser)
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    const permissions = await this.getRolePermissions(user.role[0]);
    if (permissions && !permissions.length)
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ROLE);

    if (!allowed(permissions, permissionExpected))
      throw new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    return { user: existsUser, permissions: permissions };
  }
}

module.exports = SharedController;
