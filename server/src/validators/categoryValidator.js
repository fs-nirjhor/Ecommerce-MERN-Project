const { body } = require("express-validator");

const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isString(),
];

module.exports = {
  validateCategory,
};
