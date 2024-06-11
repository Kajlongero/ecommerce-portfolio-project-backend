/** Payload for the Access Token
 * @param {object} user
 * @return {object}
 */

const AccessTokenPayload = (user) => ({
  sub: user.auth.id,
  uid: user.id,
  aud: ["http://localhost:3001/api/v1"],
  roles: [user.auth.role.name],
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

module.exports = {
  AccessTokenPayload,
  RefreshTokenPayload,
};
