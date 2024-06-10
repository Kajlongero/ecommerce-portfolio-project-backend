const router = require("express").Router();

const apiRouting = (app) => {
  app.use("/api/v1", router);
  // router.use('/', null)
};

module.exports = apiRouting;
