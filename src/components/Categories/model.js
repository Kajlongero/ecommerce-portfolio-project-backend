const joi = require("joi");
const { jwt } = require("../Auth/model");

const getCategorySchema = joi.object({
  categoryId: joi.number().integer().required(),
});

const createCategorySchema = joi.object({
  name: joi.string().min(1).max(60).required(),
  rt: jwt.required(),
});

const updateCategorySchema = joi.object({
  name: joi.string().min(1).max(60).required(),
  rt: jwt.required(),
});

module.exports = {
  getCategorySchema,
  createCategorySchema,
  updateCategorySchema,
};
