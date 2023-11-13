const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const { createItem } = require("../services/createItem");
const createSlug = require("../helper/createSlug");
const { findOneItem, findAllItem } = require("../services/findItem");

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
const handleGetCategoryBySlug = async (req, res, next) => {
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

module.exports = {
  handleCreateCategory,
  handleGetAllCategories,
  handleGetCategoryBySlug,
};
