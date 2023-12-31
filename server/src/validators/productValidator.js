const { body } = require("express-validator");
const { defaultProductImagePath } = require("../config/config");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Category = require("../models/categoryModel");
const createSlug = require("../helper/createSlug");

const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Products name is required.")
    .isLength({ max: 100 })
    .withMessage("Products name should less than 100 characters."),
    body("slug")
    .customSanitizer((value, { req }) => {
      return createSlug(req.body.name);
    })
    .isSlug(),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Products description is required.")
    .isLength({ min: 10, max: 100 })
    .withMessage("Products description should 10-100 characters."),
  body("image").optional().default(defaultProductImagePath), // validated by multer
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Products price is required.")
    .isFloat()
    .custom((v) => {
      return v > 0;
    })
    .withMessage("Products price must be positive number."),
  body("quantity")
    .trim()
    .isInt({ min: 1 })
    .withMessage("Products quantity must be positive number.")
    .default(1),
  body("sold")
    .optional()
    .default(1)
    .trim()
    .isInt({ min: 1 })
    .withMessage("Products sold amount must be positive number."),
  body("shipping")
    .optional()
    .default(0)
    .trim()
    .isNumeric({ min: 0 })
    .withMessage("Products shipping cost must be positive number."),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Products category is required.")
    .custom(async (v) => {
      const isValid = mongoose.Types.ObjectId.isValid(v);
      if (!isValid) {
        throw createHttpError("The category must be a valid ObjectId.");
      }
      const isExist = await Category.exists({ _id: v });
      if (!isExist) {
        throw createHttpError("This category is not exist in database.");
      }
      return true;
    }),
];

const validateUpdateProduct = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Products name should less than 100 characters."),
  body("slug")
    .optional()
    .customSanitizer((value, { req }) => {
      const name = req.body.name;
      return name ? createSlug(name) : value;
    })
    .isSlug(),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage("Products description should 10-100 characters."),
  body("image").optional().default(defaultProductImagePath), // validated by multer
  body("price")
    .optional()
    .trim()
    .isFloat()
    .custom((v) => {
      return v > 0;
    })
    .withMessage("Products price must be positive number."),
  body("quantity")
    .optional()
    .trim()
    .isInt({ min: 1 })
    .withMessage("Products quantity must be positive number.")
    .default(1),
  body("sold")
    .optional()
    .default(1)
    .trim()
    .isInt({ min: 1 })
    .withMessage("Products sold amount must be positive number."),
  body("shipping")
    .optional()
    .default(0)
    .trim()
    .isNumeric({ min: 0 })
    .withMessage("Products shipping cost must be positive number."),
  body("category")
    .optional()
    .trim()
    .custom(async (v) => {
      const isValid = mongoose.Types.ObjectId.isValid(v);
      if (!isValid) {
        throw createHttpError("The category must be a valid ObjectId.");
      }
      const isExist = await Category.exists({ _id: v });
      if (!isExist) {
        throw createHttpError("This category is not exist in database.");
      }
      return true;
    }),
];

module.exports = { validateProduct, validateUpdateProduct };
