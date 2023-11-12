const slugify = require("slugify");
const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const { createItem } = require("../services/createItem");

const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, {
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
      locale: "vi",
      trim: true,
    });
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
