require("dotenv").config();

const serverConfigs = {
  PORT: process.env.SERVER_PORT || 3001,
  HOST: process.env.SERVER_HOST || "localhost",
};

module.exports = {
  serverConfigs,
};
