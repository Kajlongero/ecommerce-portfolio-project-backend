const joi = require("joi");
const { jwt } = require("../Auth/model");

const getProductSchema = joi.object({
  productId: joi.number().integer().required(),
});

const getProductByCategorySchema = joi.object({
  c: joi.string().alphanum().required(),
});

const getImageProductSchema = joi.object({
  imageId: joi.string(),
});

const createProductSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().min(1).max(480).required(),
  price: joi.number().required(),
  stock: joi.number().integer().required(),
  weight: joi.number(),
  dimensions: joi.string().alphanum(),
  color: joi.string().alphanum(),
  rt: jwt.required(),
});

const updateProductSchema = joi.object({
  name: joi.string(),
  description: joi.string().min(1).max(480),
  price: joi.number(),
  stock: joi.number().integer(),
  weight: joi.number(),
  dimensions: joi.string().alphanum(),
  color: joi.string().alphanum(),
  active: joi.boolean(),
  rt: jwt.required(),
});

const idImagesProductSchema = joi.object({
  ids: joi.array().items(joi.string()),
  rt: jwt.required(),
});

module.exports = {
  getProductSchema,
  getProductByCategorySchema,
  getImageProductSchema,
  createProductSchema,
  updateProductSchema,
  idImagesProductSchema,
};
