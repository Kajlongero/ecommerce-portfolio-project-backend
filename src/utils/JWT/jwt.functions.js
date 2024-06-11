const { sign, verify } = require("jsonwebtoken");
const { unauthorized, forbidden } = require("@hapi/boom");
const ErrorSwitch = require("./jwt.errors.switch");
const secrets = require("../../configs/jwt.configs");

const SignAccessToken = (data) => {
  const payload = {
    ...data,
    iat: Math.floor(new Date().getTime() / 1000),
    exp: Math.floor(new Date().getTime() / 1000) + 60 * 60,
  };

  return sign(payload, secrets.ACCESS_TOKEN_SECRET);
};

const SignRefreshToken = (data) => {
  const payload = {
    ...data,
    iat: Math.floor(new Date().getTime() / 1000),
    exp: Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24 * 90,
  };

  return sign(payload, secrets.REFRESH_TOKEN_SECRET);
};

const DecodeAccessToken = (token) => {
  return verify(token, secrets.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const { message } = ErrorSwitch(err);

      throw new unauthorized(message);
    }

    return payload;
  });
};

const DecodeRefreshToken = (token) => {
  return verify(token, secrets.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const { message } = ErrorSwitch(err);

      throw new unauthorized(message);
    }

    return payload;
  });
};

module.exports = {
  SignAccessToken,
  SignRefreshToken,
  DecodeAccessToken,
  DecodeRefreshToken,
};
