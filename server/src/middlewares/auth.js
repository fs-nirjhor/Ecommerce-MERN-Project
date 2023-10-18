const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      throw createHttpError("401", "User is not logged in.");
    }
    const decoded = await jwt.verify(token, jwtAccessKey);
    if (!decoded) {
      throw createHttpError("401", "Invalid access token");
    }
    req.body.userId = decoded._id;
    next();
  } catch (error) {
    next(error);
  }
};
const isLoggedOut = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (token) {
      throw createHttpError("401", "User is already logged in.");
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isLoggedIn, isLoggedOut };
