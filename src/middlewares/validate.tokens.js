const { badRequest, unauthorized } = require("@hapi/boom");
const {
  AccessTokenSchema,
  RefreshTokenSchema,
  PasswordAuthorizedChangeSchema,
} = require("../components/Auth/model");
const {
  DecodeAccessToken,
  DecodeRefreshToken,
  DecodeChangePasswordToken,
} = require("../utils/JWT/jwt.functions");
const { WhereId } = require("../components/Shared/utils/prisma.objects");
const RESPONSE_MESSAGES = require("../responses/response.messages");
const prisma = require("../connections/prisma.connection");

const ValidateAccessToken = (req, res, next) => {
  const field = req.headers["authorization"];
  const rawToken = field?.split(" ")[1] || "";

  const { error: tokenError, data, message } = DecodeAccessToken(rawToken);
  if (tokenError) return next(new unauthorized(message));

  const { error } = AccessTokenSchema.validate(data, { abortEarly: false });
  if (error) next(new badRequest("Token not allowed for this action."));

  req.user = data;

  next();
};

const ValidateRefreshToken = async (req, res, next) => {
  const token = req.body.rt || req.headers["x-refresh-token-x"] || "";

  const { error: tokenError, data, message } = DecodeRefreshToken(token);
  if (tokenError) return next(new unauthorized(message));

  const { error } = RefreshTokenSchema.validate(data, { abortEarly: false });

  if (error) return next(new badRequest("Token not allowed for this action."));
  req.rt = data;

  const _active = await prisma.activeSessions.findUnique(WhereId(data.sub));
  if (!_active) next(new unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_SESSION));

  next();
};

const ValidatePasswordChangeToken = (req, res, next) => {
  const body = req.body;

  const token = req.body.t || "";

  const { error: tokenError, data, message } = DecodeRefreshToken(token);
  if (tokenError) next(new unauthorized(message));

  const { error } = PasswordAuthorizedChangeSchema.validate(body, {
    abortEarly: false,
  });
  if (error) next(new badRequest("Token not allowed for this action"));

  req.change = data;

  next();
};

module.exports = {
  ValidateAccessToken,
  ValidateRefreshToken,
  ValidatePasswordChangeToken,
};
