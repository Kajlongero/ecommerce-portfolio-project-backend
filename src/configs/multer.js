const multer = require("multer");
const dirname = require("../dirname");
const path = require("path");
const { randomUUID } = require("crypto");
const { notAcceptable } = require("@hapi/boom");

const ALLOWED_IMAGES_MIMETYPES = ["image/png", "image/jpg", "image/jpeg"];

const set = new Set(ALLOWED_IMAGES_MIMETYPES);

const ProfileImagesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(dirname, "uploads", "images", "profile"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const newName = `${randomUUID()}${ext}`;

    cb(null, newName);
  },
});

const ProductImagesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(dirname, "uploads", "images", "profile"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const newName = `${randomUUID()}${ext}`;

    cb(null, newName);
  },
});

const UploadProfileImages = multer({
  dest: path.join(dirname, "uploads", "images", "profile"),
  storage: ProfileImagesStorage,
  limits: {
    fileSize: 512000,
  },
  fileFilter: (req, file, cb) => {
    if (!set.has(file.mimetype)) {
      throw new notAcceptable("Image mimetype must be JPG, PNG or JPEG");
    }
    cb(null, true);
  },
});

const UploadProductImages = multer({
  dest: path.join(dirname, "uploads", "images", "products"),
  storage: ProductImagesStorage,
  limits: {
    fileSize: 8192000,
  },
  fileFilter: (req, file, cb) => {
    if (!set.has(file.mimetype)) {
      throw new notAcceptable("Image mimetype must be JPG, PNG or JPEG");
    }
    cb(null, true);
  },
});

module.exports = { UploadProfileImages, UploadProductImages };
