const { successResponse } = require("./responseController");
const { createItem } = require("../services/createItem");
const createHttpError = require("http-errors");
const Product = require("../models/productModel");
const { defaultProductImagePath } = require("../config/config");

const handleCreateProduct = async (req, res, next) => {
  try {
    const image = req.file ? req.file.path : defaultProductImagePath;
    const newProduct = { ...req.body, image };
    const product = await createItem(Product, newProduct);
    return successResponse(res, {
      statusCode: 201,
      message: `Product added successfully`,
      payload: {product}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleCreateProduct };
