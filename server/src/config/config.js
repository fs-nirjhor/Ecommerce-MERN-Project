const defaultUserImagePath = "public/images/users/avatar.png";
const userImagePath = "public/images/users";
const maxImageSize = 2 * 1024 * 1024; //2MB
const allowedImageExtensions = [".jpg", ".jpeg", ".png"];

module.exports = {
  defaultUserImagePath,
  userImagePath,
  maxImageSize,
  allowedImageExtensions,
};
