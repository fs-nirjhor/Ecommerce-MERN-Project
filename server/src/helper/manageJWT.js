const jwt = require("jsonwebtoken");
const logger = require("./winstonLogger");

const createJwt = (payload, jwtActivationKey, expiresIn = "10m") => {
  // check validity of payload
  if (typeof payload !== "object" || Object.keys(payload).length === 0) {
    throw new Error("JWT payload must be non-empty object");
  }
  if (typeof jwtActivationKey !== "string" || jwtActivationKey === "") {
    throw new Error("JWT secret key must be non-empty string");
  }
  try {
    const token = jwt.sign(payload, jwtActivationKey, { expiresIn: expiresIn });
    return token;
  } catch (error) {
    logger.error("Failed to create JWT", error.message);
    throw error;
  }
};

module.exports = { createJwt };
