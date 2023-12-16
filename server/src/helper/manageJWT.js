const jwt = require("jsonwebtoken");
const logger = require("./winstonLogger");

const createJwt = (data, jwtActivationKey, expiresIn = "10m") => {

  if (typeof jwtActivationKey !== "string" || jwtActivationKey === "") {
    throw new Error("JWT secret key must be non-empty string");
  }
  try {
    const token = jwt.sign(data, jwtActivationKey, { expiresIn });
    return token;
  } catch (error) {
    logger.error("Failed to create JWT", error.message);
    throw error;
  }
};

module.exports = { createJwt };
