const fakeData = require("../fakeData");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const seedItems = require("../services/seedItem");
const { successResponse } = require("./responseController");

const handleSeedUsers = async (req, res, next) => {
  try {
    data = fakeData.users;
    const users = await seedItems(User, data);
    return successResponse(res, {
      statusCode: 201,
      message: "Users seed successfully",
      payload: { users },
    });
  } catch (error) {
    next(error);
  }
};
const handleSeedCategories = async (req, res, next) => {
  try {
    data = fakeData.categories;
    const categories = await seedItems(Category, data);
    return successResponse(res, {
      statusCode: 201,
      message: "Categories seed successfully",
      payload: { categories },
    });
  } catch (error) {
    next(error);
  }
};
const handleSeedProducts = async (req, res, next) => {
  try {
    data = fakeData.products;
    const products = await seedItems(Product, data);
    return successResponse(res, {
      statusCode: 201,
      message: "Products seed successfully",
      payload: { products },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleSeedUsers, handleSeedProducts, handleSeedCategories };
