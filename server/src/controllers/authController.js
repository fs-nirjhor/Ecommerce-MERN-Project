const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findOneItem } = require("../services/findItem");
const { createJwt } = require("../helper/manageJWT");
const bcrypt = require("bcryptjs");
const createHttpError = require("http-errors");
const { jwtAccessKey } = require("../secret");

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
    // create access token
    const accessToken = await createJwt({ user }, jwtAccessKey, "15m");

    // set cookie
    res.cookie("access_token", accessToken, {
      maxAge: 15 * 60 * 1000, // 15 minute
      httpOnly: true,
      //secure: true, // not include in headers
      sameSite: "none", // call from multiple addresses
    });
    // prevent showing password in payload
    const userWithoutPassword = await findOneItem(
      User,
      { email },
      { password: 0 }
    );
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
    return successResponse(res, {
      statusCode: 200,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleLogin, handleLogout };
