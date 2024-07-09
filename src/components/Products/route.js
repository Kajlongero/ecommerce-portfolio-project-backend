const router = require("express").Router();

const ProductsController = require("./controller");

const { UploadProductImages } = require("../../configs/multer");
const {
  LimitOffsetQueryParser,
  SearchQueryParser,
} = require("../../middlewares/filters.parsers");
const { limitOffsetSchema, searchSchema } = require("../Shared/model");
const { validateSchema } = require("../../middlewares/joi.validator");
const {
  SuccessResponseBody,
  SuccessResponseBoth,
} = require("../../responses/success.response");
const {
  getProductSchema,
  getProductByCategorySchema,
  createProductSchema,
  updateProductSchema,
  getImageProductSchema,
  idImagesProductSchema,
} = require("./model");
const {
  ValidateAccessToken,
  ValidateRefreshToken,
} = require("../../middlewares/validate.tokens");
const {
  IndividualImageDimensions,
  MultipleImageDimensions,
} = require("../../middlewares/images.dimensions");

UploadProductImages.array("product-images", 12);

router.get(
  "/",
  validateSchema(limitOffsetSchema, "query"),
  LimitOffsetQueryParser,
  async (req, res, next) => {
    try {
      const filters = req.filters;

      const products = await ProductsController.getProducts(filters);

      SuccessResponseBody(req, res, products, 200);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/category/:c",
  validateSchema(limitOffsetSchema, "query"),
  validateSchema(getProductByCategorySchema, "params"),
  LimitOffsetQueryParser,
  async (req, res, next) => {
    try {
      const { c } = req.params;

      const filters = req.filters;

      const products = await ProductsController.getProductByCategory(
        c,
        filters
      );

      SuccessResponseBody(req, res, products, 200);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/search",
  validateSchema(searchSchema, "query"),
  LimitOffsetQueryParser,
  SearchQueryParser,
  async (req, res, next) => {
    try {
      const filters = req.filters;

      console.log(filters);

      const products = await ProductsController.getProductBySearchAndFilters(
        filters
      );

      SuccessResponseBody(req, res, products, 200);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:productId",
  validateSchema(getProductSchema, "params"),
  async (req, res, next) => {
    try {
      const { productId } = req.params;

      const product = await ProductsController.getProductById(
        parseInt(productId)
      );

      SuccessResponseBody(req, res, product, 200);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/create",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(createProductSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const user = req.user;

      const created = await ProductsController.createProduct(user, body);

      SuccessResponseBoth(req, res, created, "Created successfully", 200);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/update/:productId",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(getProductSchema, "params"),
  validateSchema(updateProductSchema, "body"),
  async (req, res, next) => {
    try {
      const { productId } = req.params;

      const body = req.body;
      const user = req.user;
      const id = parseInt(productId);

      delete body.rt;

      const updated = await ProductsController.updateProduct(user, id, body);

      SuccessResponseBoth(req, res, updated, "Updated successfully", 200);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/update-cover-image/:productId",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(getProductSchema, "params"),
  validateSchema(getImageProductSchema, "query"),
  UploadProductImages.single("cover-image"),
  IndividualImageDimensions,
  async (req, res, next) => {
    try {
      const { imageId } = req.query;
      const { productId } = req.params;

      const file = req.file;
      const user = req.user;

      const updated = await ProductsController.setCoverImage(
        user,
        productId,
        file || undefined,
        imageId || undefined
      );

      SuccessResponseBoth(req, res, updated, "Updated successfully", 200);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/remove-cover-image/:productId",
  validateSchema(getProductSchema, "params"),
  ValidateAccessToken,
  ValidateRefreshToken,
  async (req, res, next) => {
    try {
      const { productId: id } = req.params;

      const user = req.user;
      const updated = await ProductsController.removeCoverImage(
        user,
        parseInt(id)
      );

      SuccessResponseBoth(req, res, updated, "Removed successfully", 200);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/add-product-images/:productId",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(getProductSchema, "params"),
  UploadProductImages.array("product-images", 13),
  MultipleImageDimensions,
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const user = req.user;

      const id = parseInt(productId);
      const files = req.files;

      const added = await ProductsController.addProductImages(user, id, files);

      SuccessResponseBody(req, res, added, 200);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/remove-product-images/:productId",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(getProductSchema, "params"),
  validateSchema(idImagesProductSchema, "body"),
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const user = req.user;

      const { ids } = req.body;
      const id = parseInt(productId);

      const removed = await ProductsController.removeProductImages(
        user,
        id,
        ids
      );

      SuccessResponseBody(req, res, removed, 200);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete/:productId",
  ValidateAccessToken,
  ValidateRefreshToken,
  validateSchema(getProductSchema, "params"),
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const id = parseInt(productId);

      const user = req.user;

      const deleted = await ProductsController.deleteProduct(user, id);

      SuccessResponseBody(req, res, deleted, 200);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
