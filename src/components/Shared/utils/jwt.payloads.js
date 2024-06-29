/** Payload for the Access Token
 * @param {object} user
 * @return {object}
 */

const AccessTokenPayload = (user) => ({
  sub: user.auth.id,
  uid: user.id,
  aud: ["http://localhost:3001/api/v1"],
  role: [user.auth.role.name],
});

/** Payload for the Refresh Token
 * @param {object} user
 * @return {object}
 */

const RefreshTokenPayload = (user, rId) => ({
  sub: rId,
  uid: user.id,
  aud: ["http://localhost:3001/api/v1"],
});

const PasswordChangeTokenPayload = (user, rId) => ({
  sub: user.auth.id,
  uid: user.id,
  rid: rId,
  aud: ["http://localhost:3001/api/v1/auth/request-change/change-password"],
});

module.exports = {
  AccessTokenPayload,
  RefreshTokenPayload,
  PasswordChangeTokenPayload,
};
