const { body } = require("express-validator");
const { defaultUserImagePath } = require("../config/config");

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
  body("image")
  .isString()
  .withMessage("Image must be a string.")
  .optional()
  .default(defaultUserImagePath),
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
];

module.exports = { validateUserRegistration };
