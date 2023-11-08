const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findOneItem } = require("../services/findItem");
const { createJwt } = require("../helper/manageJWT");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const createHttpError = require("http-errors");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //? is email and password provided
    if (!email || !password) {
      throw createHttpError(403, "Please input your email and password");
    }

    //? is user exist
    const user = await findOneItem(User, { email });

    //? is password matched
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createHttpError(403, "Wrong password");
    }

    //? is user banned
    if (user.isBanned) {
      throw createHttpError(403, "This account is banned");
    }
    // set access token
    const accessToken = await createJwt({ user }, jwtAccessKey, "5m");
    
    res.cookie("access_token", accessToken, {
      maxAge: 5 * 60 * 1000, // 5 minute
      httpOnly: true,
      //TODO: secure is comment out for development purpose. secure cookies not work in postman but work in browser well. need 4 change in this file
      //secure: true, // not include in headers
      sameSite: "none", // call from multiple addresses
    });
    
    // set refresh token
    const refreshToken = await createJwt({ user }, jwtRefreshKey, "7d");
    res.cookie("refresh_token", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
      httpOnly: true,
      //secure: true, 
      sameSite: "none", 
    });
    // prevent showing password in payload. user from database is not a pure object
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return successResponse(res, {
      statusCode: 200,
      message: "Logged in successfully",
      payload: { user: userWithoutPassword },
    });
  } catch (error) {
    return next(error);
  }
};
const handleLogout = async (req, res, next) => {
  try {
    // check access cookie
    if (!req.cookies.access_token) {
      throw createHttpError(401, "User already logged out");
    }
    // clear access cookie
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return successResponse(res, {
      statusCode: 200,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refresh_token;
    const decoded = jwt.verify(oldRefreshToken, jwtRefreshKey);
    if (!decoded) {
      throw createHttpError(400, "JWT refresh token is invalid or expired");
    }
    const user = decoded.user;
    // set access token
    const accessToken = await createJwt({ user }, jwtAccessKey, "5m");
    res.cookie("access_token", accessToken, {
      maxAge: 5 * 60 * 1000, // 5 minute
      httpOnly: true,
      //secure: true, 
      sameSite: "none", 
    });
    // set refresh token
    const refreshToken = await createJwt({ user }, jwtRefreshKey, "7d");

    res.cookie("refresh_token", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day 
      httpOnly: true,
      //secure: true, 
      sameSite: "none", 
    });
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return successResponse(res, {
      statusCode: 200,
      message: "Refreshed token successfully",
      payload: {user: userWithoutPassword},
    });
  } catch (error) {
    return next(error);
  }
};
const handleProtectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    const decoded = jwt.verify(accessToken, jwtAccessKey);
    if (!decoded) {
      throw createHttpError(400, "JWT access token is invalid or expired");
    }    
    return successResponse(res, {
      statusCode: 200,
      message: "Protected route accessed successfully",
      payload: {},
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
};
