// router for 'api/products'

const express = require("express");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const runValidations = require("../validators");
const { handleCreateProduct, handleGetAllProducts } = require("../controllers/productController");
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


module.exports = productRouter;
