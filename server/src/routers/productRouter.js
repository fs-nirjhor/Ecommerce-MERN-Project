// router for 'api/products'

const express = require("express");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const runValidations = require("../validators");
const { handleCreateProduct, handleGetAllProducts, handleGetProduct, handleDeleteProduct, handleUpdateProduct } = require("../controllers/productController");
const { validateProduct } = require("../validators/productValidator");
const uploadProductImage = require("../middlewares/uploadProduct");

const productRouter = express.Router();

//POST: api/products
productRouter.post(
  "/",
  uploadProductImage.single("image"),
  isLoggedIn,
  isAdmin,
  validateProduct,
  runValidations,
  handleCreateProduct
);

//GET: api/products
productRouter.get("/", handleGetAllProducts)

//GET: api/products/slug
productRouter.get("/:slug", handleGetProduct)

//DELETE: api/products/slug
productRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteProduct)

//PUT: api/products
productRouter.put(
  "/:slug",
  uploadProductImage.single("image"),
  isLoggedIn,
  isAdmin,
  handleUpdateProduct
);

module.exports = productRouter;
