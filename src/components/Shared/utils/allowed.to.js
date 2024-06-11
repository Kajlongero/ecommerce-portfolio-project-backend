const { badData } = require("@hapi/boom");

/**
 * @param {string[]} permissions
 * @param {string} role
 */

const allowedToReadUserInfo = (permissions, role) => {
  if (!Array.isArray(permissions)) throw new badData();
  if (typeof role !== "string") throw new badData();

  const set = new Set(permissions);

  return set.has(`READ_${role}_INFO`);
};

module.exports = { allowedToReadUserInfo };
