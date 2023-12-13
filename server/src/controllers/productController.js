const { successResponse } = require("./responseController");
const { createItem } = require("../services/createItem");
const createHttpError = require("http-errors");
const Product = require("../models/productModel");
const { defaultProductImagePath, maxImageSize } = require("../config/config");
const { setPagination } = require("../helper/managePagination");
const { deleteItem } = require("../services/deleteItem");
const { findOneItem } = require("../services/findItem");
const createSlug = require("../helper/createSlug");

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
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      $or: [
        { name: { $regex: searchRegExp } },
        { slug: { $regex: searchRegExp } },
        { description: { $regex: searchRegExp } },
        { category: { $regex: searchRegExp } },
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
    const deletedProduct = await deleteItem(Product, { slug }); 
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
    const currentProduct = await findOneItem(Product, {slug});
    const updates = {};
    const updateOptions = { new: true, runValidators: true, context: "query" };
    const updateKeys = ["name", "description", "price", "quantity", "sold", "shipping", "category"];
    const { user, ...data } = req.body; // user is set in req.body from isLoggedIn middleware. it must not include in data
    for (let key in data) {
       if (!updateKeys.includes(key)) {
        throw createHttpError(400, `${key} can\'t be updated`);
      } 
      if (data[key] === currentProduct[key]) {
        throw createHttpError(409, `${key} is already updated`);
      }
      updates[key] = data[key];
    }

    if(data.name){
      updates.slug = createSlug(data.name);
    }

    const image = req.file;
    if (image) {
      if (image.size > maxImageSize) {
        throw new Error(
          `Image size can\'t exceed ${maxImageSize / 1024 / 1024}MB.`
        );
      }
      updates.image = image.path;
    }
    
    const updatedProduct = await Product.findOneAndUpdate(
      {slug},
      updates,
      updateOptions
    ).populate("category").select("-createdAt -updatedAt -__v");
    if (!updatedProduct) {
      throw new Error("Product can't be updated");
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
  handleUpdateProduct
};
