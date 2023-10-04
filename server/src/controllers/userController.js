// manage getting all user data

const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findItemById } = require("../services/findItem");
const deleteImage = require("../helper/deleteImage");
const { createJwt } = require("../helper/manageJWT");
const { secretJwtKey, clientUrl } = require("../secret");
const jwt = require("jsonwebtoken");
const sendMail = require("../helper/useNodemailer");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 1;
    const userRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true }, // not equal
      $or: [
        // multiple filters
        { name: { $regex: userRegExp } },
        { email: { $regex: userRegExp } },
        { phone: { $regex: userRegExp } },
      ],
    };
    const options = { password: 0 }; // not include
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.find(filter).countDocuments();
    const pagination = {
      total: Math.ceil(count / limit),
      current: page,
      previous: page - 1 > 0 ? page - 1 : null,
      next: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
    };
    if (!users.length) throw createHttpError(404, "No users found"); // this error will be catch()
    return successResponse(res, {
      statusCode: 200,
      message: `${users.length} / ${count} users returned`,
      payload: { users, pagination },
    });
  } catch (error) {
    next(error); // next refers to error handler.
  }
};

const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findItemById(User, id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User returned successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.findOneAndDelete({
      _id: id,
      isAdmin: false,
    });
    if (!deletedUser) throw createHttpError(400, "User cannot be deleted");
    // removing saved image of deleted user
    deleteImage(deletedUser.image);
    return successResponse(res, {
      statusCode: 200,
      message: "User deleted successfully",
      payload: { deletedUser },
    });
  } catch (error) {
    // handle mongoose error
    if (error instanceof mongoose.Error) {
      next(createHttpError(400, `Invalid user id.`));
      return;
    }
    next(error);
  }
};
const processRegister = async (req, res, next) => {
  try {
    const newUser = req.body;
    const { name, email, password, address, phone } = newUser;
    // check if email already registered
    const isRegistered = await User.exists({ email: email });
    // conflict error
    if (isRegistered)
      throw createHttpError(409, "Email already be registered. Please login.");
    // create jwt token
    const token = createJwt(newUser, secretJwtKey, "10m");
    // send verification email
    const mailData = {
      email,
      subject: "Account Verification Email",
      html: `
      <h2>Hello ${name}</h2>
      <p>Click here to <a href='${clientUrl}/api/users/api/users/activate/${token}' target="_blank" rel="noopener noreferrer">activate your email</a></p>
      `,
    };
    const mailInfo = await sendMail(mailData);
    return successResponse(res, {
      statusCode: 200,
      message: `Verification mail sent to ${email}`,
      payload: { token, mailInfo },
    });
  } catch (error) {
    next(error);
  }
};
const verifyUser = async (req, res, next) => {
  try {
    const token = req.body.token;
    // verify jwt token
    var decoded = jwt.verify(token, secretJwtKey);
    // register new user to database
    const user = await User.create(decoded);
    return successResponse(res, {
      statusCode: 200,
      message: `User verified successfully`,
      payload: { decoded, user },
    });
  } catch (error) {
    // check if user is already registered
    if (error.name === "MongoServerError") {
      next(createHttpError(400, "Email already registered. Please login."));
      return;
    }
    next(error);
  }
};

module.exports = { getUsers, getUser, deleteUser, processRegister, verifyUser };
