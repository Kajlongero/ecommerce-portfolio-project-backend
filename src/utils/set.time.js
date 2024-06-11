const { badData } = require("@hapi/boom");

/**
 * Function that compares actual ISO Date with another param ISO Date, it returns true if the provided ISO Date is higher than the actual ISO Date
 * @param {string} date
 * @return {boolean}
 */

const compareDates = (date) => {
  if (typeof date !== "string") throw new badData();

  const parseDate = Date.parse(date);
  if (!parseDate) throw new badData();

  const d1 = new Date().toISOString();
  const d2 = new Date(date).toISOString();

  return d2 > d1;
};

/**Function to calculate time based on attempts
 * @param {number} attempts
 * @return {string}
 */

const isoTimeByAttempts = (attempts) => {
  if (attempts !== "number") throw new badData();

  const date = new Date();
  const calc = Math.pow(attempts, 2);

  date.setMinutes(date.getTime() + calc);
  return date.toISOString();
};

module.exports = {
  isoTimeByAttempts,
  compareDates,
};
