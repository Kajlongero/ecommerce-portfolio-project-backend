const boom = require("@hapi/boom");
const sharp = require("sharp");

const IndividualImageDimensions = async (req, res, next) => {
  const file = req.file;

  if (file && !Object.keys(file).length) next();

  const { width, height } = await sharp(file.path).metadata();
  const _file = { ...file, width, height };

  req.file = { ..._file };

  next();
};

const MultipleImageDimensions = async (req, res, next) => {
  const files = req.files;

  if (files && !files.length) next();

  const arr = await files.map(async (f) => {
    const { width, height } = await sharp(f.path);
    return { ...f, width, height };
  });

  req.files = [...arr];

  next();
};

module.exports = { IndividualImageDimensions, MultipleImageDimensions };
