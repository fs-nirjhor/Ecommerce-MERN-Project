const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const { createItem } = require("../services/createItem");
const createSlug = require("../helper/createSlug");
const { findOneItem, findAllItem, updateItem } = require("../services/findItem");
const createHttpError = require("http-errors");

const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const slug = createSlug(name);
    const newCategory = await createItem(Category, { name, slug });
    return successResponse(res, {
      statusCode: 201,
      message: "Category created successfully",
      payload: { category: newCategory },
    });
  } catch (error) {
    next(error);
  }
};
const handleGetAllCategories = async (req, res, next) => {
  try {
    const categories = await findAllItem(Category);
    return successResponse(res, {
      statusCode: 200,
      message: "Categories fetched successfully",
      payload: { categories },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await findOneItem(Category, { slug });
    return successResponse(res, {
      statusCode: 200,
      message: "Category get successfully",
      payload: { category },
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;
    const newSlug = createSlug(name);
    if (slug === newSlug) { throw createHttpError(409, "Category is already updated"); }
    const filter = { slug };
    const updates = { $set: { name: name, slug: newSlug } };
    const options = { new: true, runValidators: true, context: "query" };

    const updatedCategory = await updateItem(Category, filter, updates, options);

    return successResponse(res, {
      statusCode: 200,
      message: "Category updated successfully",
      payload: { updatedCategory },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateCategory,
  handleGetAllCategories,
  handleGetCategory,
  handleUpdateCategory,
};
