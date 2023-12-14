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

// api/seed/users
seedRouter.post(
  "/users",
  isLoggedIn,
  isAdmin,
  uploadUserImage.single("image"),
  handleSeedUsers
);
// api/seed/products
seedRouter.post(
  "/products",
  isLoggedIn,
  isAdmin,
  uploadUserImage.single("image"),
  handleSeedProducts
);
// api/seed/categories
seedRouter.post("/categories", isLoggedIn, isAdmin, handleSeedCategories);

module.exports = seedRouter;
