const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const { createItem } = require("../services/createItem");
const createSlug = require("../helper/createSlug");
const createHttpError = require("http-errors");
const { findOneItem } = require("../services/findItem");
const { updateItem } = require("../services/updateItem");
const { deleteItem } = require("../services/deleteItem");

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
    const categories = await Category.find()
      .select("-createdAt -updatedAt -__v")
      .lean();
    if (!categories.length) {
      throw createHttpError(404, "No Category found");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Categories fetched successfully",
      payload: { categories },
    });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createHttpError(400, `Failed to fetch ${Model.modelName}.`);
    }
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
    if (slug === newSlug) {
      throw createHttpError(409, "Category is already updated");
    }
    const filter = { slug };
    const updates = { $set: { name: name, slug: newSlug } };
    const options = { new: true, runValidators: true, context: "query" };

    const updatedCategory = await updateItem(
      Category,
      filter,
      updates,
      options
    );

    return successResponse(res, {
      statusCode: 200,
      message: "Category updated successfully",
      payload: { updatedCategory },
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const filter = { slug };
    const deletedCategory = await deleteItem(Category, filter);
    return successResponse(res, {
      statusCode: 200,
      message: `${deletedCategory.name} category deleted successfully`,
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
  handleDeleteCategory,
};
