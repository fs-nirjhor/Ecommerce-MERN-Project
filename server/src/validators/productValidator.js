const { body } = require("express-validator");
const {
  defaultUserImagePath,
  defaultUserImageBuffer,
  maxImageSize,
  allowedImageExtensions,
} = require("../config/config");
const createHttpError = require("http-errors");
const logger = require("../helper/winstonLogger");

const validateProduct = [
  body("name")
    .trim() // remove unnecessary whitespace
    .notEmpty() // required
    .withMessage("Please enter your name.")
    .isLength({ min: 3, max: 31 })
    .withMessage("User name should have 3-31 characters."),
  body("image")
  .custom((value, { req }) => {
    //! this image filter will not make any effect because the case's are already handled by multer filter.
    const image = req.file;
    if (!image) {
       logger.info("Image not selected");
       return true;
    }
    if (!image.mimetype.startsWith("image/")) {
      throw new Error("Only image is allowed");
    }

    const allowedMimetypePattern = new RegExp(
      `^image\/(${allowedImageExtensions.join("|")})$`,
      "i"
    );
    if (!allowedMimetypePattern.test(image.mimetype)) {
      throw new Error(
        `Invalid image format. Only ${allowedImageExtensions
          .join(", ")
          .toUpperCase()} are allowed.`
      );
    }

    if (image.size > maxImageSize) {
      throw new Error(
        `Image size can\'t exceed ${maxImageSize / 1024 / 1024}MB.`
      );
    }
    return true;
  }),
];


module.exports = { validateProduct };
