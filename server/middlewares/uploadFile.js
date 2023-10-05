const multer = require("multer");
const path = require("path");
const createHttpError = require("http-errors");
const {
  maxImageSize,
  allowedImageExtensions,
  userImagePath,
} = require("../src/config/config");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, userImagePath);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const filename =
      file.originalname.replace(extension, "") + "_" + Date.now() + extension;
    cb(null, filename);
  },
});

const fileFilter = function (req, file, cb) {
  const extension = path.extname(file.originalname);
  if (!allowedImageExtensions.includes(extension)) {
    return cb(
      new Error(`Try allowed file types (${allowedImageExtensions})`),
      false
    );
  }
  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxImageSize },
});

module.exports = upload;
