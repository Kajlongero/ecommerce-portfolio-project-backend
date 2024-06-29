const { sign, verify } = require("jsonwebtoken");
const { unauthorized, forbidden } = require("@hapi/boom");
const ErrorSwitch = require("./jwt.errors.switch");
const secrets = require("../../configs/jwt.configs");

/**
 * Function that receives a data payload and returns a JWT
 * @param {object} data Object which contains a payload such as sub, aud, etc...
 * @returns {string}
 */

const SignAccessToken = (data) => {
  const payload = {
    ...data,
    iat: Math.floor(new Date().getTime() / 1000),
    exp: Math.floor(new Date().getTime() / 1000) + 60 * 60,
  };

  return sign(payload, secrets.ACCESS_TOKEN_SECRET);
};

/**
 * Function that receives a data payload and returns a JWT
 * @param {object} data Object which contains a payload such as sub, aud, etc...
 * @returns {string}
 */

const SignRefreshToken = (data) => {
  const payload = {
    ...data,
    iat: Math.floor(new Date().getTime() / 1000),
    exp: Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24 * 90,
  };

  return sign(payload, secrets.REFRESH_TOKEN_SECRET);
};

/**
 * Function that receives a data payload and returns a JWT
 * @param {object} data Object which contains a payload such as sub, aud, etc...
 * @returns {string}
 */

const SignChangePasswordToken = (data) => {
  const payload = {
    ...data,
    iat: Math.floor(new Date().getTime() / 1000),
    exp: Math.floor(new Date().getTime() / 1000) + 60 * 15,
  };

  return sign(payload, secrets.CHANGE_PASSWORD_TOKEN_SECRET);
};

/**
 * Function that receives a JWT and returns a decoded payload if the token is valid or has not expired
 * @param {string} token
 * @returns {import("jsonwebtoken").JwtPayload}
 */

const DecodeAccessToken = (token) => {
  return verify(token, secrets.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const { message } = ErrorSwitch(err);

      return {
        error: true,
        message: message,
        data: null,
      };
    }

    return {
      error: false,
      data: payload,
      message: "",
    };
  });
};

/**
 * Function that receives a JWT and returns a decoded payload if the token is valid or has not expired
 * @param {string} token
 * @returns
 */

const DecodeRefreshToken = (token) => {
  return verify(token, secrets.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const { message } = ErrorSwitch(err);

      return {
        error: true,
        message: message,
        data: null,
      };
    }

    return {
      error: false,
      data: payload,
      message: "",
    };
  });
};

/**
 * Function that receives a JWT and returns a decoded payload if the token is valid or has not expired
 * @param {string} token
 * @returns
 */

const DecodeChangePasswordToken = (token) => {
  const data = verify(
    token,
    secrets.CHANGE_PASSWORD_TOKEN_SECRET,
    (err, payload) => {
      if (err) {
        const { message } = ErrorSwitch(err);

        return {
          error: true,
          message: message,
          data: null,
        };
      }

      return {
        error: false,
        data: payload,
        message: "",
      };
    }
  );

  return data;
};

module.exports = {
  SignAccessToken,
  SignRefreshToken,
  SignChangePasswordToken,
  DecodeAccessToken,
  DecodeRefreshToken,
  DecodeChangePasswordToken,
};
