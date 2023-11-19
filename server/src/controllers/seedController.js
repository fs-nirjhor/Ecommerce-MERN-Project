const fakeData = require("../fakeData");
const Product = require("../models/productModel");
const User = require("../models/userModel");

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
    await Product.deleteMany({});
    const products = await Product.insertMany(fakeData.products);
    res.status(201).json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = { handleSeedUsers, handleSeedProducts };
