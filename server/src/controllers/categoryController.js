
const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const { createItem } = require("../services/createItem");
const createSlug = require("../helper/createSlug");

const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const slug = createSlug(name);
    const newCategory = await createItem(Category, { name, slug });
    return successResponse(res, {
      statusCode: 201,
      message: "Category created successfully",
      payload: {category : newCategory},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleCreateCategory };
