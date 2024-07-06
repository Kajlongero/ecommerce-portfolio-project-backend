const { UploadProductImages } = require("../../configs/multer");

const router = require("express").Router();

UploadProductImages.array("product-images", 12);
