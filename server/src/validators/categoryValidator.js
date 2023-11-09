const { body } = require("express-validator");

const validateCategoryRegistration = [
  body("name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Category name is required."),
  body("slug")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .toLowerCase()
    .isSlug(),
];

module.exports = {
  validateCategoryRegistration,
};
