const joi = require("joi");

const uuid = joi.string().uuid();
const string = joi.string();
const base64 = joi.string().base64();
const jwt = joi
  .string()
  .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/);

const bearerJwt = joi
  .string()
  .regex(/Bearer ^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/);

const roles = joi
  .string()
  .valid(
    "CUSTOMER",
    "OWNER",
    "CUSTOMER_SERVICE",
    "VIP",
    "ANONYMOUS",
    "ADMIN",
    "ADMINISTRATIVE",
    "PARTNER",
    "INVENTORY_MANAGER"
  );

const AccessTokenSchema = joi.object({
  sub: uuid.required(),
  uid: uuid.required(),
  aud: joi.array().items(joi.string()).required(),
  role: joi.array().items(roles).required(),
  iat: joi.number().integer().required(),
  exp: joi.number().integer().required(),
});

const RefreshTokenSchema = joi.object({
  sub: string.required(),
  uid: uuid.required(),
  aud: joi.array().items(joi.string()).required(),
  iat: joi.number().integer().required(),
  exp: joi.number().integer().required(),
});

const AuthorizePasswordChangeTokenSchema = joi.object({
  sub: string.required(),
  uid: uuid.required(),
  aud: joi
    .array()
    .valid("http://localhost:3001/api/v1/auth/request-change/change-password")
    .required(),
  iat: joi.number().integer().required(),
  exp: joi.number().integer().required(),
});

const SessionIdAndId = joi.object({
  id: uuid.optional(),
  sid: uuid.required(),
  rt: jwt.required(),
});

const PatchUserRoleSchema = joi.object({
  userId: uuid.required(),
  roleId: joi.number().integer().min(1).max(512),
  rt: jwt.required(),
});

const PasswordRecoveryRequestSchema = joi.object({
  email: joi.string().email().min(3).max(150).required(),
});

const PasswordRecoveryTokenSchema = joi.object({
  t: base64.required(),
});

const PasswordAuthorizedChangeSchema = joi.object({
  t: jwt.required(),
  password: string.min(8).max(64).required(),
});

module.exports = {
  AccessTokenSchema,
  RefreshTokenSchema,
  SessionIdAndId,
  PatchUserRoleSchema,
  PasswordRecoveryRequestSchema,
  PasswordRecoveryTokenSchema,
  AuthorizePasswordChangeTokenSchema,
  PasswordAuthorizedChangeSchema,
  jwt,
};
