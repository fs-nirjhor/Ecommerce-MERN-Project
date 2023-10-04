// all environment variables

require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3002;
const databaseUrl =
  process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerceMernDB";
const defaultUserImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/avatar.png";
const secretJwtKey = process.env.SECRET_JWT_KEY || "abcd1234@#$%^&*";
const smtpUser = process.env.SMTP_USER || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";
const clientUrl = process.env.CLIENT_URL || "";
const userImagePath = process.env.USER_IMAGE_PATH || "public/images/users";

module.exports = {
  serverPort,
  databaseUrl,
  defaultUserImagePath,
  secretJwtKey,
  smtpUser,
  smtpPassword,
  clientUrl,
  userImagePath,
};
