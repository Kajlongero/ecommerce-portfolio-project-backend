const boom = require("@hapi/boom");

const OPTIONS =
  "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789";

const NUMBERS = "0123456789";

/** Receives a chararacter length in multiples of 4, and returns an id according to that length and adds a "-" per every multiple of 4. i.e: 4 --> aY0c ; 8 --> nsKG-ujs1
 * @param {number} length The length must be a multiple of 4, i.e: 4, 8, 12, 16, 20
 * @returns {string} String id, if 8 --> nsKG-ujs1
 */

const randomId = (length = 16) => {
  if (typeof length !== "number")
    throw new boom.badData("Length must be a number");
  if (length % 4 !== 0)
    throw new boom.badData(
      "Length must be a multiple of 4, i.e: 4, 8, 12, 16, 20"
    );

  let id = "";

  for (let i = 0; i < length; i++) {
    if (i % 4 === 0 && i !== 0) id += `-`;

    id += `${OPTIONS.charAt(Math.round(Math.random() * OPTIONS.length))}`;
  }

  return id;
};

/** Function that receives a number length and returns a random code according to that param length
 * @param {number} length
 * @returns {number}
 */

const randomCode = (length = 6) => {
  if (typeof length !== "number")
    throw new boom.badData("Length must be a number");

  let code = "";

  for (let i = 0; i < length; i++) {
    id += `${NUMBERS.charAt(Math.round(Math.random() * NUMBERS.length))}`;
  }

  return parseInt(code);
};

module.exports = { randomId, randomCode };
