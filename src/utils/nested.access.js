const { badData } = require("@hapi/boom");

const nestedAccess = (object, ...internals) => {
  if (typeof object !== "object" && internals.length > 0) return object;

  const copy = [...internals];

  const val = copy[0];
  const lowered = String(val).toLowerCase();

  const access = object[lowered];

  copy.splice(0, 1);

  object = access;
  internals = [...copy];

  if (internals.length < 1) return object;
  nestedAccess(object, internals);
};

const parseObjectCoincidences = (original = {}, ...coinc) => {
  if (typeof original !== "object") throw new badData();

  const coincidences = new Set(coinc);

  let actual = {};
  let before = {};
  let after = {};
};

module.exports = { nestedAccess };
