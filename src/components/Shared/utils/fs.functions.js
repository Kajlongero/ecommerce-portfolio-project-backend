const path = require("path");
const fs = require("node:fs/promises");

const boom = require('@hapi/boom');

const isDir = async (relativePath) => {
  const fullPath = path.join(relativePath, path.sep);

  try {
    await fs.stat(fullPath, (err, stats) => {
      if (err) {
        throw new boom.badImplementation();
      }

      if (!stats.isDirectory()) {
        return {
          path: fullPath,
          isDir: false,
        };
      }
    });
  } catch (e) {
    throw new boom.internal();
  }

  return {
    path: fullPath,
    isDir: true,
  };
};

const listFilesWithouExt = async (fullPath) => {
  const _files = await fs.readdir(fullPath);

  let obj = {};

  _files.forEach((f) => {
    const filename = f.substring(0, f.lastIndexOf("."));
    const ext = path.extname(f);

    obj[filename] = {
      filename: filename,
      ext: ext,
    };
  });

  return obj;
};

module.exports = {
  isDir,
  listFilesWithouExt,
};
