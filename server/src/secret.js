// all environment variables

require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3002;
const databaseUrl =
  process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerceMernDB";
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "jwtActivationKey";
const jwtAccessKey = process.env.JWT_ACCESS_KEY || "jwtAccessKey";
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || "jwtRefreshKey";
const jwtResetPasswordKey =
  process.env.JWT_RESET_PASSWORD_KEY || "jwtResetPasswordKey";
const smtpUser = process.env.SMTP_USER || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";
const clientUrl = process.env.CLIENT_URL || "";
const cloudinaryName = process.env.CLOUDINARY_NAME || "";
const cloudinaryKey = process.env.CLOUDINARY_KEY || "";
const cloudinarySecret = process.env.CLOUDINARY_SECRET || "";

module.exports = {
  serverPort,
  databaseUrl,
  jwtActivationKey,
  jwtAccessKey,
  jwtResetPasswordKey,
  jwtRefreshKey,
  smtpUser,
  smtpPassword,
  clientUrl,
  cloudinaryName,
  cloudinaryKey,
  cloudinarySecret,
};
