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
  handleDeleteCategory,
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
categoryRouter.delete(
  "/:slug",
  isLoggedIn,
  isAdmin,
  handleDeleteCategory
);

module.exports = categoryRouter;
