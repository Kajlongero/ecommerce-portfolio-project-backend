const joi = require("joi");

const limitOffsetSchema = joi.object({
  l: joi.number().integer().max(120),
  o: joi.number().integer().min(0),
});

/**
 * l: limit
 * o: offset
 * q: query
 * c: color
 * p: price
 * v: votes average
 * s: stock
 * mnd: minimun date, example: 2020
 * mxd: maximum date, example: 2021 - this must be high than mnd
 */

const searchSchema = joi.object({
  l: joi.number().integer().min(1).max(120),
  o: joi.number().integer().min(0),
  q: joi.string(),
  c: joi.string(),
  p: joi.number(),
  v: joi.number().min(1.0).max(5.0),
  s: joi.number().integer().max(250),
  mnd: joi.number().integer().min(1970).max(new Date().getFullYear()),
});

module.exports = {
  searchSchema,
  limitOffsetSchema,
};
