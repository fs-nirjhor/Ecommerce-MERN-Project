// seed api for "/api/seed"

const express = require("express");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const {
  handleSeedUsers,
  handleSeedProducts,
  handleSeedCategories,
} = require("../controllers/seedController");
const seedRouter = express.Router();
// TODO: image can be uploaded as path string or buffer string
//const upload = require("../middlewares/uploadBufferFile"); //buffer
const {
  uploadUserImage,
  uploadProductImage,
} = require("../middlewares/uploadFile"); //string
const { validateUserRegistration } = require("../validators/userValidator");
const runValidations = require("../validators");
const { validateProduct } = require("../validators/productValidator");
const { validateCategory } = require("../validators/categoryValidator");

// api/seed/users
seedRouter.post(
  "/users",
  isLoggedIn,
  isAdmin,
  uploadUserImage.single("image"),
  validateUserRegistration,
  runValidations,
  handleSeedUsers
);
// api/seed/products
seedRouter.post(
  "/products",
  isLoggedIn,
  isAdmin,
  uploadProductImage.single("image"),
  validateProduct,
  runValidations,
  handleSeedProducts
);
// api/seed/categories
seedRouter.post(
  "/categories",
  isLoggedIn,
  isAdmin,
  validateCategory,
  runValidations,
  handleSeedCategories
);

module.exports = seedRouter;
