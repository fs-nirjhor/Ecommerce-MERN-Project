const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findOneItem } = require("../services/findItem");
const { createJwt } = require("../helper/manageJWT");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const createHttpError = require("http-errors");
const { request } = require("express");

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //? is email and password provided 
    if (!email || !password) {throw createHttpError(403, 'Please input your email and password');}

    //? is user exist
    const user = await findOneItem(User, {email});

    //? is password matched
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw createHttpError(403, "Wrong password")
    }

    //? is user banned
    if (user.isBanned) {throw createHttpError(403, "This account is banned");}
    
    return successResponse(res, {
      statusCode: 200,
      message: "Logged in successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleLogin };
