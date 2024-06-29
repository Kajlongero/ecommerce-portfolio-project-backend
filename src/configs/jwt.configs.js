require("dotenv").config();

const JwtConfigs = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  CHANGE_PASSWORD_TOKEN_SECRET: process.env.CHANGE_PASSWORD_TOKEN_SECRET,
  CONFIRM_AUTH_USER_SECRET: process.env.CONFIRM_AUTH_USER_SECRET,
};

module.exports = JwtConfigs;
