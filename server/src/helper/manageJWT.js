const jwt = require("jsonwebtoken");

const createJWT = (payload, secretJwtKey, expiresIn = "10m") => {
  // check validity of payload
  if (typeof payload !== "object" || Object.keys(payload).length === 0) {
    throw new Error("JWT payload must be non-empty object");
  }
  if (typeof secretJwtKey !== "string" || secretJwtKey === "") {
    throw new Error("JWT secret key must be non-empty string");
  }
  try {
    const token = jwt.sign(payload, secretJwtKey, { expiresIn: expiresIn });
    return token;
  } catch (error) {
    console.log('Failed to sign JWT', error.message);
    throw error;
  }
};

module.exports = { createJWT };
