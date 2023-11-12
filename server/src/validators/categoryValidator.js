const { body } = require("express-validator");

const validateCategoryRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isString(),
];

module.exports = {
  validateCategoryRegistration,
};
