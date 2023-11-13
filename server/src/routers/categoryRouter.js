// router for 'api/category'

const express = require("express");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const runValidations = require("../validators");
const { validateCategory } = require("../validators/categoryValidator");
const {
  handleCreateCategory,
  handleGetAllCategories,
  handleGetCategory,
  handleUpdateCategory,
} = require("../controllers/categoryController");
const categoryRouter = express.Router();

//POST: api/category
categoryRouter.post(
  "/",
  isLoggedIn,
  isAdmin,
  validateCategory,
  runValidations,
  handleCreateCategory
);
//GET: api/category
categoryRouter.get("/", handleGetAllCategories);
//GET: api/category/:slug
categoryRouter.get("/:slug", handleGetCategory);
//UPDATE: api/category/:slug
categoryRouter.put(
  "/:slug",
  isLoggedIn,
  isAdmin,
  validateCategory,
  runValidations,
  handleUpdateCategory
);

module.exports = categoryRouter;
