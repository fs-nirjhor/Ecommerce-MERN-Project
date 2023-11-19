// seed api for "/api/seed"

const express = require("express");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const { handleSeedUsers, handleSeedProducts } = require("../controllers/seedController");
const seedRouter = express.Router();

// api/seed/users
seedRouter.post("/users", isLoggedIn, isAdmin, handleSeedUsers);
// api/seed/products
seedRouter.post("/products", isLoggedIn, isAdmin, handleSeedProducts);

module.exports = seedRouter;
