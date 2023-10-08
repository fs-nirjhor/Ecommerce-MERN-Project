const multer = require("multer");
const { maxImageSize, allowedImageExtensions } = require("../config/config");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!fileFilter.memeType.startWith("image/")) {
    const error = new Error("Only image is allowed");
    return cb(error, false);
  }
  const extension = file.memeType.replace("image/", "");
  if (!allowedImageExtensions.includes(extension)) {
    const error = new Error(
      `Try allowed file types (${allowedImageExtensions})`
    );
    return cb(error, false);
  }
  if (file.size > maxImageSize) {
    const error = new Error(
      `File size can\'t exceed ${maxImageSize / 1024 / 1024} MB`
    );
    return cb(error, false);
  }
  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
