const fs = require("node:fs/promises");
const boom = require("@hapi/boom");

const { isDir, listFilesWithouExt } = require("./fs.functions");

const deleteImagesInBulk = async (imagesPath, images = []) => {
  if (images && !images.length) return null;

  if (!images.every((img) => typeof img === "string"))
    throw new boom.notAcceptable("Invalid images identifiers");

  const { isDir: dir, path: fullPath } = await isDir(imagesPath);
  if (!dir) throw new boom.internal();

  const files = await listFilesWithouExt(fullPath);
  const set = new Set(Object.keys(files));

  images.forEach(async (img) => {
    const parsed = img.split('.').at(0);

    if (!set.has(parsed)) return;

    const file = `${fullPath}${files[parsed].filename}${files[parsed].ext}`;

    await fs.unlink(file, (err) => {
      if (err) {
        throw new boom.badImplementation();
      }
    });
  });

  return true;
};

module.exports = { deleteImagesInBulk };
