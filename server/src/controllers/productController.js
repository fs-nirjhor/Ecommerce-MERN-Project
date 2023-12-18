const { successResponse } = require("./responseController");
const { createItem } = require("../services/createItem");
const createHttpError = require("http-errors");
const Product = require("../models/productModel");
const { defaultProductImagePath, maxImageSize } = require("../config/config");
const { setPagination } = require("../helper/managePagination");
const { deleteItem } = require("../services/deleteItem");
const { findOneItem } = require("../services/findItem");
const createSlug = require("../helper/createSlug");
const deleteImage = require("../helper/deleteImage");
const { updateManyKey } = require("../services/updateItem");

const handleCreateProduct = async (req, res, next) => {
  try {
    const image = req.file?.path || defaultProductImagePath;
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
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      $or: [
        { name: { $regex: searchRegExp } },
        { slug: { $regex: searchRegExp } },
        { description: { $regex: searchRegExp } },
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
const handleDeleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const filter = { slug };
    const deletedProduct = await deleteItem(Product, filter, defaultProductImagePath);
    return successResponse(res, {
      statusCode: 200,
      message: `${deletedProduct.name} deleted successfully`,
      payload: { deletedProduct },
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateProduct = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const updateKeys = [
      "name",
      "slug", // set by validator
      "description",
      "price",
      "quantity",
      "sold",
      "shipping",
      "category",
      "image",
    ];
    const filter = {slug};
    const options = { populate: { path: 'category' } };
    const updatedProduct = await updateManyKey(Product, filter, updateKeys, req, defaultProductImagePath, options);  
    if (!updatedProduct) {
      throw createHttpError("Product can't be updated");
    }  
    return successResponse(res, {
      statusCode: 200,
      message: "Product updated successfully",
      payload: { updatedProduct },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProduct,
  handleGetAllProducts,
  handleGetProduct,
  handleDeleteProduct,
  handleUpdateProduct,
};
