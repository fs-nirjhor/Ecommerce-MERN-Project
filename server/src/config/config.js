const avatarBuffer = require("../../public/images/users/avatarBuffer");

const defaultUserImagePath = "public/images/users/avatar.png";
const userImagePath = "public/images/users";
const productImagePath = "public/images/products";
const maxImageSize = 2 * 1024 * 1024; //2MB
const allowedImageExtensions = ["jpg", "jpeg", "png"];
const defaultUserImageBuffer = avatarBuffer;
const defaultProductImagePath = "public/images/products/default-product-image.png";

module.exports = {
  defaultUserImagePath,
  userImagePath,
  productImagePath,
  maxImageSize,
  allowedImageExtensions,
  defaultUserImageBuffer,
  defaultProductImagePath,
};