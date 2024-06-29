const router = require("express").Router();
const authRouter = require("./Auth/route");
const userRouter = require("./User/route");

const apiRouting = (app) => {
  app.use("/api/v1", router);
  router.use("/auth", authRouter);
  router.use("/user", userRouter);
};

module.exports = apiRouting;
