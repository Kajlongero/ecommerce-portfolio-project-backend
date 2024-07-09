const router = require("express").Router();
const controller = require("./controller");
const { SuccessResponseBody } = require("../../responses/success.response");
const { validateSchema } = require("../../middlewares/joi.validator");
const {
  SearchQueryParser,
  LimitOffsetQueryParser,
} = require("../../middlewares/filters.parsers");
const { limitOffsetSchema } = require("../Shared/model");
const {
  getCategorySchema,
  createCategorySchema,
  updateCategorySchema,
} = require("./model");
const {
  ValidateAccessToken,
  ValidateRefreshToken,
} = require("../../middlewares/validate.tokens");

router.get(
  "/",
  validateSchema(limitOffsetSchema, "query"),
  LimitOffsetQueryParser,
  async (req, res, next) => {
    try {
      const filters = req.filters;
      const categories = await controller.getAllCategories(filters);

      SuccessResponseBody(req, res, categories, 200);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:categoryId",
  validateSchema(getCategorySchema, "params"),
  async (req, res, next) => {
    try {
      const { categoryId } = req.params;

      const categoryInfo = await controller.getCategoryById(categoryId);

      SuccessResponseBody(req, res, categoryInfo, 200);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/create",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(createCategorySchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const user = req.user;

      const created = await controller.createCategory(user, body);

      SuccessResponseBody(req, res, created, 200);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/update/:categoryId",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(getCategorySchema, "params"),
  validateSchema(updateCategorySchema, "body"),
  async (req, res, next) => {
    try {
      const { categoryId } = req.params;

      const body = req.body;
      const user = req.user;

      const updated = await controller.updateCategoryName(user, {
        ...body,
        categoryId,
      });

      SuccessResponseBody(req, res, updated, 200);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete/:categoryId",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(getCategorySchema, "params"),
  async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const user = req.user;

      const deleted = await controller.deleteCategory(user, categoryId);

      SuccessResponseBody(req, res, deleted, 200);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
