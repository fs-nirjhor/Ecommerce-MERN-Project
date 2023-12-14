const multer = require("multer");
const { maxImageSize, allowedImageExtensions } = require("../config/config");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    const error = new Error("Only image file is allowed");
    return cb(error, false);
  }
  const extension = file.mimetype.replace("image/", "");
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
  fileFilter,
  limits: { fileSize: maxImageSize },
});

module.exports = upload; 
