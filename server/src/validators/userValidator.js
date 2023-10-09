const { body } = require("express-validator");
const {
  defaultUserImagePath,
  defaultUserImageBuffer,
  maxImageSize,
  allowedImageExtensions,
} = require("../config/config");

const validateUserRegistration = [
  body("name")
    .trim() // remove unnecessary whitespace
    .notEmpty() // required
    .withMessage("Please enter your name.")
    .isLength({ min: 3, max: 31 })
    .withMessage("User name should have 3-31 characters."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Please enter your email address.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .toLowerCase(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Please enter your password.")
    .isStrongPassword()
    .withMessage(
      "Password must have at least 8 characters and at least 1 uppercase, 1 lowercase, 1 number and 1 special character."
    ),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Please enter your address.")
    .isLength({ min: 3 })
    .withMessage("Address should have at least 3 characters."),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Please enter your phone number.")
    .isLength({ min: 5 })
    .withMessage("Phone should have at least 5 characters."),
  body("image")
  .custom((value, { req }) => {
    //! this image filter will not make any effect because the case's are already handled by multer filter.
    const image = req.file;
    if (!image) {
       console.log("Image not selected");
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

module.exports = { validateUserRegistration };
