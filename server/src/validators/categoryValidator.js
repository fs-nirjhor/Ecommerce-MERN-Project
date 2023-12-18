const { body } = require("express-validator");
const createSlug = require("../helper/createSlug");

const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isString(),
  body("slug")
    .customSanitizer((value, { req }) => {
      return createSlug(req.body.name);
    })
    .isSlug(),
];

module.exports = {
  validateCategory,
};
