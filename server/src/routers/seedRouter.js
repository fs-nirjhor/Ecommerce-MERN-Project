// seed api for "/api/seed"

const express = require("express");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const { handleSeedUsers, handleSeedProducts, handleSeedCategories } = require("../controllers/seedController");
const seedRouter = express.Router();
// TODO: image can be uploaded as string (save image to server and save path to database) or buffer (save image as buffer to database). Any one import should be choose here.
//const upload = require("../middlewares/uploadBufferFile"); //buffer
const upload = require("../middlewares/uploadFile");  //string

// api/seed/users
seedRouter.post("/users",upload.single("image"), isLoggedIn, isAdmin, handleSeedUsers);
// api/seed/products
seedRouter.post("/products",upload.single("image"), isLoggedIn, isAdmin, handleSeedProducts);
// api/seed/categories
seedRouter.post("/categories", isLoggedIn, isAdmin, handleSeedCategories);

module.exports = seedRouter;
