// router for 'api/products'

const express = require("express");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const runValidations = require("../validators");
const { handleCreateProduct } = require("../controllers/productController");
const upload = require("../middlewares/uploadFile");
const { validateProduct } = require("../validators/productValidator");

const productRouter = express.Router();

//POST: api/products
productRouter.post(
  "/",
  upload.single("image"),
  isLoggedIn,
  isAdmin,
  //validateProduct,
  //runValidations,
  handleCreateProduct
);

/* 
//GET: api/products
productRouter.get("/", handleGetAllProducts);
//GET: api/products/:slug
productRouter.get("/:slug", handleGetProduct);
//UPDATE: api/products/:slug
productRouter.put(
  "/:slug",
  isLoggedIn,
  isAdmin,
  validateProduct,
  runValidations,
  handleUpdateProduct
);
productRouter.delete(
  "/:slug",
  isLoggedIn,
  isAdmin,
  handleDeleteProduct
); 
*/

module.exports = productRouter;
