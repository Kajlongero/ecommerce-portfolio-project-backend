const { badData } = require("@hapi/boom");

/** Receives a first parameter containing an array of strings (permissions), and a second parameter that is a permission expected to be on the list and returns true if exists
 * @param {string[]} permissions
 * @param {string} permissionExpected
 * @return {boolean}
 */

const allowed = (permissions, permissionExpected = "") => {
  if (!Array.isArray(permissions)) throw new badData();
  if (typeof permissionExpected !== "string") throw new badData();

  const set = new Set(permissions);

  return set.has(permissionExpected);
};

module.exports = { allowed };
