const { badData } = require("@hapi/boom");

/** Function to verify if user has read user info permissions
 * @param {string[]} permissions
 * @param {string} role
 * @returns {boolean}
 */

const allowedToReadUserInfo = (permissions, role) => {
  if (!Array.isArray(permissions)) throw new badData();
  if (typeof role !== "string") throw new badData();

  const set = new Set(permissions);

  return set.has(`READ_${role}_INFO`);
};

/** Function to verify if user has create users permissions
 * @param {string[]} permissions
 * @param {string} role
 * @returns {boolean}
 */
const allowedToCreate = (permissions, role) => {
  if (!Array.isArray(permissions)) throw new badData();
  if (typeof role !== "string") throw new badData();

  const set = new Set(permissions);

  return set.has(`CREATE_${role}`);
};

module.exports = { allowedToReadUserInfo, allowedToCreate };
