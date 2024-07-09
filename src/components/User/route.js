// dependencies
const router = require("express").Router();

// esentials
const { UploadProfileImages } = require("../../configs/multer");
const { validateSchema } = require("../../middlewares/joi.validator");
const {
  ValidateAccessToken,
  ValidateRefreshToken,
} = require("../../middlewares/validate.tokens");
const {
  SuccessResponseMessage,
  SuccessResponseBody,
  SuccessResponseBoth,
} = require("../../responses/success.response");
const {
  getCustomerOptionalSchema,
  updateUserSchema,
  updatePasswordSchema,
  changeEmailSchema,
} = require("./model");
const {
  PasswordRecoveryTokenSchema: ConfirmEmailTokenSchema,
} = require("../Auth/model");
const UserController = require("./controller");
const {
  IndividualImageDimensions,
} = require("../../middlewares/images.dimensions");

// utils

router.get(
  "/user-info",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(getCustomerOptionalSchema, "query"),
  async (req, res, next) => {
    try {
      const { id } = req.query;
      const user = req.user;

      const idOrUid = id ?? user.uid;

      const userData = await UserController.getUserInfo(user, idOrUid);
      const obj = { user: userData, sessionId: req.rt.sub };

      SuccessResponseBody(req, res, obj, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/confirm-email",
  validateSchema(ConfirmEmailTokenSchema, "query"),
  async (req, res, next) => {
    try {
      const { t: token } = req.query;
      const confirm = await UserController.confirmUser(token);

      SuccessResponseBody(req, res, confirm, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/update-cover-image",
  ValidateAccessToken,
  ValidateRefreshToken,
  UploadProfileImages.single("cover-image"),
  IndividualImageDimensions,
  async (req, res, next) => {
    try {
      const user = req.user;
      const file = req.file;

      const uploaded = await UserController.updateCoverImage(user, file);

      SuccessResponseBody(req, res, uploaded, 200);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/update-email",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(changeEmailSchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.query;

      const user = req.user;
      const rt = req.rt;

      const idOrUid = id ?? user.uid;

      const email = req.body.email;
      const newEmail = await UserController.updateEmail(user, idOrUid, email);

      SuccessResponseBody(req, res, newEmail, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update-password",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(updatePasswordSchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.query;

      const user = req.user;
      const idOrUid = id ?? user.uid;

      const { oldPassword, newPassword } = req.body;
      const password = await UserController.updatePassword(
        user,
        idOrUid,
        oldPassword,
        newPassword
      );

      SuccessResponseBody(req, res, password, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update-info",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(updateUserSchema, "body"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const body = req.body;

      const update = await UserController.updateUserInfo(user, body);

      SuccessResponseBody(req, res, update, 200);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete-user",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(getCustomerOptionalSchema, "query"),
  async (req, res, next) => {
    try {
      const { id } = req.query;

      const user = req.user;
      const idOrUid = id ?? user.uid;

      const deleted = await UserController.deleteUser(user, idOrUid);

      SuccessResponseBody(req, res, deleted, 200);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
