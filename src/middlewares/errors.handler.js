const boom = require("@hapi/boom");
const multer = require("multer");
const { MulterErrorsReducer } = require("../utils/multer.errors.reducer");

/** Middleware that throws an error if is Boom Type or delegate the error to another middleware
 *
 * @param {Error} err
 * @param {Express.Request} req
 * @param {*} res
 * @param {*} next
 * @returns {Express.Response}
 */

const MulterErrorHandler = (err, req, res, next) => {
  if (!(err instanceof multer.MulterError)) return next(err);

  const { message } = MulterErrorsReducer(err);

  return res.status(400).json({
    statusCode: 400,
    error: "Error Uploading File",
    message: message,
  });
};

const TypeErrorHandler = (err, req, res, next) => {
  return next(err);
};

const BoomErrorHandler = (err, req, res, next) => {
  if (!err.isBoom) return next(err);

  const { payload } = err.output;
  return res.status(payload.statusCode).json(payload);
};

const ServerErrorHandler = (err, req, res, next) => {
  console.log(err);

  return res.status(500).json({
    statusCode: 500,
    error: "Internal Server Error",
    message: "An internal error has ocurred",
  });
};

module.exports = {
  MulterErrorHandler,
  BoomErrorHandler,
  TypeErrorHandler,
  ServerErrorHandler,
};
