const { successResponse } = require("./responseController");
const { createItem } = require("../services/createItem");
const createHttpError = require("http-errors");
const Product = require("../models/productModel");
const { defaultProductImagePath } = require("../config/config");
const { setPagination } = require("../helper/managePagination");

const handleCreateProduct = async (req, res, next) => {
  try {
    const image = req.file ? req.file.path : defaultProductImagePath;
    const newProduct = { ...req.body, image };
    const product = await createItem(Product, newProduct);
    return successResponse(res, {
      statusCode: 201,
      message: `Product added successfully`,
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetAllProducts = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const regExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      $or: [
        { name: { $regex: regExp } },
        { slug: { $regex: regExp } },
        { description: { $regex: regExp } },
      ],
    };
    const products = await Product.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("category")
      .sort({ createdAt: -1 })
      .select("-createdAt -updatedAt -__v");
    const count = await Product.find(filter).countDocuments();
    const pagination = setPagination(count, limit, page);
    if (!products || products.length === 0) {
      throw createHttpError(404, "No products found");
    }
    return successResponse(res, {
      statusCode: 200,
      message: `${products.length} / ${count} products returned`,
      payload: { products, pagination },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug })
      .populate("category")
      .select("-createdAt -updatedAt -__v");
    if (!product) {
      throw createHttpError(404, "No product found with this slug");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Product get successfully",
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProduct,
  handleGetAllProducts,
  handleGetProduct,
};
