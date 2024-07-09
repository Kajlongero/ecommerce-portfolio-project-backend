const boom = require("@hapi/boom");
const sharp = require("sharp");

const IndividualImageDimensions = async (req, res, next) => {
  const file = req.file;
  if (!file) next();

  if (file && !Object.keys(file).length) next();

  const { width, height } = await sharp(file.path).metadata();
  const _file = { ...file, width, height };

  req.file = { ..._file };

  next();
};

const MultipleImageDimensions = async (req, res, next) => {
  const files = req.files;

  if (!files) next();
  if (files && !files.length) next();

  let arr = [];

  for await (let image of files) {
    const file = await sharp(image.path).metadata();
    arr.push({ ...image, width: file.width, height: file.height });
  }

  req.files = [...arr];
  next();
};

module.exports = { IndividualImageDimensions, MultipleImageDimensions };
