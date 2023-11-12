const { body } = require("express-validator");

const validateCategoryRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isString(),
  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isSlug(),
  //.toLowerCase()
];

module.exports = {
  validateCategoryRegistration,
};
