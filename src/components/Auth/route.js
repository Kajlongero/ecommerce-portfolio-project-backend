// dependencies
const router = require("express").Router();

// esentials
const {
  SuccessResponseBody,
  SuccessResponseMessage,
} = require("../../responses/success.response");
const {
  ValidateRefreshToken,
  ValidateAccessToken,
  ValidatePasswordChangeToken,
} = require("../../middlewares/validate.tokens");

const AuthController = require("./controller");
const UserController = require("../User/controller");
const { validateSchema } = require("../../middlewares/joi.validator");
const {
  loginSchema,
  createCustomerSchema,
  createEmployeeSchema,
} = require("../User/model");
const {
  SessionIdAndId,
  PatchUserRoleSchema,
  PasswordRecoveryRequestSchema,
  PasswordRecoveryTokenSchema,
  PasswordAuthorizedChangeSchema,
} = require("./model");

// utils

router.post("/refresh-token", ValidateRefreshToken, async (req, res, next) => {
  try {
    const rt = req.rt;
    const pair = await AuthController.tokenPair(rt);

    SuccessResponseBody(req, res, pair, 200);
  } catch (e) {
    next(e);
  }
});

router.get(
  "/active-sessions",
  ValidateAccessToken,
  ValidateRefreshToken,
  async (req, res, next) => {
    try {
      const { id } = req.query;

      const user = req.user;
      const sessions = await AuthController.activeSessions(user, id);

      SuccessResponseBody(req, res, sessions, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/blacklisted-sessions",
  ValidateAccessToken,
  ValidateRefreshToken,
  async (req, res, next) => {
    try {
      const { id } = req.query;

      const user = req.user;
      const sessions = await AuthController.blacklistedSessions(user, id);

      SuccessResponseBody(req, res, sessions, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/login",
  validateSchema(loginSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const data = await AuthController.login(body);

      SuccessResponseBody(req, res, data, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/customer/signup",
  validateSchema(createCustomerSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const data = await UserController.createCustomer(body);

      SuccessResponseBody(req, res, data, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/employee/register",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(createEmployeeSchema, "body"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const body = req.body;

      const data = await UserController.addEmployee(user, body);

      SuccessResponseBody(req, res, data, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/password-recovery/request",
  validateSchema(PasswordRecoveryRequestSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body.email;
      const recovery = await AuthController.requestPasswordChange(body);

      SuccessResponseBody(req, res, recovery, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/password-recovery/verify",
  validateSchema(PasswordRecoveryTokenSchema, "query"),
  async (req, res, next) => {
    try {
      const { t: token } = req.query;
      const authorize = await AuthController.validateChangeToken(token);

      SuccessResponseBody(req, res, authorize, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/password-recovery/change-password",
  ValidatePasswordChangeToken,
  validateSchema(PasswordAuthorizedChangeSchema, "body"),
  async (req, res, next) => {
    try {
      const data = req.change;
      const password = req.body.password;

      const changed = await AuthController.changePassword(data, password);

      SuccessResponseMessage(req, res, changed, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/assign-role",
  validateSchema(PatchUserRoleSchema, "body"),
  ValidateAccessToken,
  ValidateRefreshToken,
  async (req, res, next) => {
    try {
      const user = req.user;
      const data = req.body;

      const updated = await AuthController.updateUserRole(user, data);

      SuccessResponseBody(req, res, updated, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  "/close-active-session",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(SessionIdAndId, "query"),
  async (req, res, next) => {
    try {
      const { sid, id } = req.query;

      const user = req.user;
      const idOrUid = id ?? user.uid;

      const closed = await AuthController.closeActiveSession(
        user,
        idOrUid,
        sid
      );

      SuccessResponseBody(req, res, closed, 200);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
