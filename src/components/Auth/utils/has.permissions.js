const { badData } = require("@hapi/boom");

/**
 * @param {string[]} permissions
 * @param {string} permissionExpected
 * @return {boolean}
 */

const allowed = (permissions, permissionExpected = "") => {
  if (!Array.isArray(permissions)) throw new badData();
  if (typeof permissionExpected !== "string") throw new badData();

  const set = new Set([...permissions.map((p) => p.name)]);

  return set.has(permissionExpected);
};

module.exports = { allowed };
