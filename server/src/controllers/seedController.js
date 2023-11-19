const fakeData = require("../fakeData");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const seedItems = require("../services/seedItem");
const { successResponse } = require("./responseController");

const handleSeedUsers = async (req, res, next) => {
  try {
    // deleting all existing users
    await User.deleteMany({});
    // adding new users
    const users = await User.insertMany(fakeData.users);
    // successful response
    res.status(201).json(users);
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

module.exports = { handleSeedUsers, handleSeedProducts };
