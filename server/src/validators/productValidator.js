const { body } = require("express-validator");
const {
  defaultUserImagePath,
  defaultUserImageBuffer,
  maxImageSize,
  allowedImageExtensions,
} = require("../config/config");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Category = require("../models/categoryModel");

const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Products name is required.")
    .isLength({ max: 100 })
    .withMessage("Products name should less than 100 characters."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Products description is required.")
    .isLength({ min: 10, max: 100 })
    .withMessage("Products description should 10-100 characters."),
  body("image"), // validated by multer
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Products price is required.")
    .isNumeric()
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
    .default(1)
    .trim()
    .isInt({ min: 1 })
    .withMessage("Products sold amount must be positive number."),
  body("shipping")
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

module.exports = { validateProduct };
