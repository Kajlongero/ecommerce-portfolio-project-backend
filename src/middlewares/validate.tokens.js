const {
  DecodeAccessToken,
  DecodeRefreshToken,
} = require("../utils/JWT/jwt.functions");

const ValidateAccessToken = (req, res, next) => {
  const field = req["authorization"];
  const rawToken = field?.split(" ")[1] || "";

  const data = DecodeAccessToken(rawToken);
  req.user = data;

  next();
};

const ValidateRefreshToken = (req, res, next) => {
  const token = req.body?.token || "";

  const data = DecodeRefreshToken(token);
  req.rt = data;

  next();
};

module.exports = { ValidateAccessToken, ValidateRefreshToken };
