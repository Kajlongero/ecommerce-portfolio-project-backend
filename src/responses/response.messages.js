const RESPONSE_MESSAGES = {
  // bad request - 400

  // unauthorized - 401
  UNAUTHORIZED_ACTION: "You cannot perform this action",
  UNAUTHORIZED_PERMISSION: "You do not have permissions for this action",
  UNAUTHORIZED_SESSION: "Invalid session token",
  UNAUTHORIZED_CREDENTIALS: "Invalid credentials",
  UNAUTHORIZED_ROLE: "Your role does not have permissions for this action",
  UNAUTHORIZED_REQUEST_PASSWORD_RESET:
    "You cannot request a password change yet",
  UNAUTHORIZED_REQUEST_CONFIRM_USER:
    "You cannot request a confirm user email yet",

  // forbidden - 403

  // not found - 404
  ROLE_NOT_FOUND: "Role not found",
  USER_NOT_FOUND: "User not found",
};

module.exports = RESPONSE_MESSAGES;
