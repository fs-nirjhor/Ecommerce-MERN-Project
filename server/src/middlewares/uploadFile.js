const multer = require("multer");
const path = require("path");
const {
  maxImageSize,
  allowedImageExtensions,
  userImagePath,
} = require("../config/config");

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

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).substring(1);
  if (!allowedImageExtensions.includes(extension)) {
    const error = new Error(
      `Try allowed file types (${allowedImageExtensions})`
    );
    return cb(error, false);
  }
  return cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: maxImageSize },
  fileFilter,
});

module.exports = upload;
