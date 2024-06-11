// dependencies
const { unauthorized, notFound, badData } = require("@hapi/boom");

// esentials
const prisma = require("../../connections/prisma.connection");
const AuthController = require("../Auth/controller");
const { IncludeUserData } = require("../Auth/utils/prisma.objects");
const { WhereId } = require("../Shared/utils/prisma.objects");

// utils
const { allowedToReadUserInfo } = require("../Shared/utils/allowed.to");

class UserController {
  async getUserById(user, id) {
    if (typeof id !== "string") throw new badData();

    const userData = await prisma.users.findUnique({
      ...WhereId(id),
      ...IncludeUserData,
    });
    if (!userData) throw new notFound("User not found");

    const p = await AuthController.getRolePermissions(user.role[0]);
    const allowed = allowedToReadUserInfo(p, user.role[0]);

    if (user.uid === id && p.includes("READ_OWN_USER_INFO")) return userData;
    if (user.uid !== id && allowed) return userData;

    throw new unauthorized();
  }

  async getByEmail(email) {
    const user = await prisma.users.findFirst({
      where: { auth: { email: email } },
      ...IncludeUserData,
    });
    if (!user) throw new unauthorized();

    return user;
  }
}

module.exports = new UserController();
