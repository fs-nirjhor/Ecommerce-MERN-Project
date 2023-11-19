// seed api for "/api/seed"

const express = require("express");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const { handleSeedUser } = require("../controllers/seedController");
const seedRouter = express.Router();

// api/seed/users
seedRouter.post("/users", isLoggedIn, isAdmin, handleSeedUser);

module.exports = seedRouter;
