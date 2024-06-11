// dependencies
const router = require("express").Router();

// utils
const { ValidateRefreshToken } = require("../../middlewares/validate.tokens");
const { SuccessResponseBody } = require("../../responses/success.response");
const AuthController = require("./controller");

router.post("/refresh-token", ValidateRefreshToken, async (req, res, next) => {
  try {
    const rt = req.rt;
    const pair = await AuthController.tokenPair(rt);

    SuccessResponseBody(req, res, pair, 200);
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const body = req.body;
    const data = await AuthController.login(body);

    SuccessResponseBody(req, res, data, 200);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
