const router = require("express").Router();
const authRouter = require("./Auth/route");
const userRouter = require("./User/route");
const categoriesRouter = require("./Categories/route");
const productsRouter = require("./Products/route");

const apiRouting = (app) => {
  app.use("/api/v1", router);
  router.use("/user", userRouter);
  router.use("/auth", authRouter);
  router.use("/categories", categoriesRouter);
  router.use("/products", productsRouter);
};

module.exports = apiRouting;
