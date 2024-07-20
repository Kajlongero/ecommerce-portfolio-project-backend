const path = require("path");

const LAST_THREE = __dirname
  .split(path.sep)
  .slice(0, __dirname.split(path.sep).length - 4)
  .join(path.sep);

const UPLOADS_DIRECTORY = path.join(
  LAST_THREE,
  "uploads",
  "images",
  "products"
);

module.exports = UPLOADS_DIRECTORY;
