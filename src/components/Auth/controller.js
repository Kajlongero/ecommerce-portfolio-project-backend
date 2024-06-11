// dependencies
const { forbidden, notFound, badData } = require("@hapi/boom");
const bcrypt = require("bcrypt");

// esentials
const prisma = require("../../connections/prisma.connection");
const UserController = require("../User/controller");
const {
  SignAccessToken,
  SignRefreshToken,
} = require("../../utils/JWT/jwt.functions");
const {
  AccessTokenPayload,
  RefreshTokenPayload,
} = require("../Shared/utils/jwt.payloads");
const {
  WhereId,
  WhereUserId,
  WhereName,
} = require("../Shared/utils/prisma.objects");

// utils
const { randomId } = require("../../utils/random.id");
const { allowed } = require("./utils/has.permissions");
const { isoTimeByAttempts, compareDates } = require("../../utils/set.time");
2;

class AuthController {
  async tokenPair(data) {
    const { sub, uid } = data;

    const user = await prisma.users.findUnique({
      ...WhereId(uid),
      ...IncludeUserData,
    });
    if (!user) throw new forbidden();

    const active = await prisma.activeSessions.findUnique(WhereId(sub));
    if (!active) throw new forbidden();

    const blacklisted = await prisma.blacklistedSessions.findUnique(
      WhereId(sub)
    );

    if (active && blacklisted) {
      await prisma.$transaction(async (tx) => {
        const sessions = await tx.activeSessions.findMany(WhereUserId(uid));

        await tx.blacklistedSessions.createMany({
          data: [...sessions.map((s) => ({ id: s.id, userId: s.userId }))],
        });

        await tx.activeSessions.deleteMany(WhereUserId(uid));
      });

      throw new forbidden("Closing sessions due to a security risk");
    }

    const rId = randomId(32);

    await prisma.$transaction(async (tx) => {
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

  async getRolePermissions(name) {
    if (typeof name !== "string") throw new badData();

    const permissions = await prisma.$transaction(async (tx) => {
      const _role = await tx.roles.findUnique(WhereName(name));
      if (!_role) throw new badData("Role does not exists");

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

  async activeSessions(user) {
    const permissions = await this.getRolePermissions(user.role[0]);

    const existsUser = await prisma.users.findUnique(WhereId(user.uid));
    if (!existsUser) throw new notFound("User not found");

    const allowedTo = allowed(permissions, "READ_OWN_SESSIONS");
    if (!allowedTo) throw new forbidden();

    const s = await prisma.activeSessions.findMany(WhereUserId(user.uid));

    return s;
  }

  async blacklistedSessions(user) {
    const permissions = await this.getRolePermissions(user.role[0]);

    const existsUser = await prisma.users.findUnique(WhereId(user.uid));
    if (!existsUser) throw new notFound("User not found");

    const allowedTo = allowed(permissions, "READ_OWN_BLACKLISTED_SESSIONS");
    if (!allowedTo) throw new forbidden();

    const s = await prisma.blacklistedSessions.findMany(WhereUserId(user.uid));

    return s;
  }

  async login(data) {
    const { email, password } = data;

    const user = await UserController.getByEmail(email);
    console.log(user);

    if (!compareDates(user.auth.timeToLoginAgain))
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

      throw new unauthorized("Invalid email or password");
    }

    const rId = randomId(32);

    await prisma.$transaction(async (tx) => {
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
}

module.exports = new AuthController();
