// all environment variables

require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3002;
const databaseUrl =
  process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerceMernDB";
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "&JwT-@cT!^atiON_keY$";
const jwtAccessKey = process.env.JWT_ACCESS_KEY || "&JwT-@ccESs_keY$";
const smtpUser = process.env.SMTP_USER || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";
const clientUrl = process.env.CLIENT_URL || "";

module.exports = {
  serverPort,
  databaseUrl,
  jwtActivationKey,
  jwtAccessKey,
  smtpUser,
  smtpPassword,
  clientUrl,
};
