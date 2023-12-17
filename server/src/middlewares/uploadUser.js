const multer = require("multer");
const path = require("path");
const {
  maxImageSize,
  allowedImageExtensions,
  userImagePath,
  productImagePath,
} = require("../config/config");

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).substring(1);
  if (!allowedImageExtensions.includes(extension)) {
    const error = new Error(
      `Try allowed image file types (${allowedImageExtensions})`
    );
    return cb(error, false);
  }
  return cb(null, true);
};

const userStorage = multer.diskStorage({
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

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productImagePath);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const filename =
      file.originalname.replace(extension, "") + "_" + Date.now() + extension;
    cb(null, filename);
  },
});


const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: maxImageSize },
  fileFilter,
});

const uploadProductImage = multer({
  storage: productStorage,
  limits: { fileSize: maxImageSize },
  fileFilter,
});

module.exports = uploadUserImage;
