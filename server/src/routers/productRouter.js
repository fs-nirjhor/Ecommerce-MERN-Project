// router for 'api/products'

const express = require("express");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const runValidations = require("../validators");
const { handleCreateProduct, handleGetAllProducts, handleGetProduct } = require("../controllers/productController");
const { validateProduct } = require("../validators/productValidator");
const upload = require("../middlewares/uploadProductImage");

const productRouter = express.Router();

//POST: api/products
productRouter.post(
  "/",
  upload.single("image"),
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


module.exports = productRouter;
