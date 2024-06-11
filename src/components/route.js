const router = require("express").Router();
const authRouter = require("./Auth/route");

const apiRouting = (app) => {
  app.use("/api/v1", router);
  router.use("/auth", authRouter);
};

module.exports = apiRouting;
