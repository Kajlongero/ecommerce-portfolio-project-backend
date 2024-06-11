const BoomErrorHandler = (err, req, res, next) => {
  if (!err.isBoom) next(err);

  const { payload } = err.output;
  return res.status(payload.statusCode).json(payload);
};

const TypeErrorHandler = (err, req, res, next) => {
  next(err);
};

const ServerErrorHandler = (err, req, res, next) => {
  return res.status(500).json({
    statusCode: 500,
    error: "Internal Server Error",
    message: "An internal error has ocurred",
  });
};

module.exports = {
  BoomErrorHandler,
  TypeErrorHandler,
  ServerErrorHandler,
};
