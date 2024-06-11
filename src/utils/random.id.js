const OPTIONS =
  "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789";

const randomId = (length = 16) => {
  let id = "";

  for (let i = 0; i < length; i++) {
    if (i % 4 === 0 && i !== 0) id += `-`;

    id += `${OPTIONS.charAt(Math.round(Math.random() * OPTIONS.length))}`;
  }

  return id;
};

module.exports = { randomId };
