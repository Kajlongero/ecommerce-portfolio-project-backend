const SuccessResponseMessage = (req, res, message, statusCode = 200) => {
  return res.status(statusCode).json({
    error: false,
    statusCode: statusCode,
    message,
  });
};

const SuccessResponseBody = (req, res, body, statusCode = 200) => {
  return res.status(statusCode).json({
    error: false,
    statusCode: statusCode,
    data: body,
  });
};

const SuccessResponseBoth = (req, res, body, message, statusCode = 200) => {
  return res.status(statusCode).json({
    error: false,
    statusCode: statusCode,
    message,
    data: body,
  });
};

module.exports = {
  SuccessResponseBoth,
  SuccessResponseMessage,
  SuccessResponseBody,
};
