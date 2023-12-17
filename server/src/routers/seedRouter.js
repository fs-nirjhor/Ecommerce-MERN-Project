// seed api for "/api/seed"

const express = require("express");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const {
  handleSeedUsers,
  handleSeedProducts,
  handleSeedCategories,
} = require("../controllers/seedController");
const seedRouter = express.Router();
// TODO: image can be uploaded as string (save image to server and save path to database) or buffer (save image as buffer to database). Any one import should be choose here.
//const upload = require("../middlewares/uploadBufferFile"); //buffer
const uploadUserImage = require("../middlewares/uploadUser"); //string
const { validateUserRegistration } = require("../validators/userValidator");
const runValidations = require("../validators");
const { validateProduct } = require("../validators/productValidator");

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
  uploadUserImage.single("image"),
  validateProduct,
  runValidations,
  handleSeedProducts
);
// api/seed/categories
seedRouter.post("/categories", isLoggedIn, isAdmin, handleSeedCategories);

module.exports = seedRouter;
