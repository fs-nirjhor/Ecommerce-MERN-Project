// manage getting all user data

const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findItemById } = require("../services/findItem");
const deleteImage = require("../helper/deleteImage");
const { createJWT } = require("../helper/manageJWT");
const { secretJwtKey } = require("../secret");

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
    const {name, email, password, address, phone} = newUser;
    const isRegistered = await User.exists({email : email})
    // conflict error
    if (isRegistered) throw createHttpError(409, "Email already be registered. Please login.");
    const token = createJWT(newUser, secretJwtKey, '5m')
    return successResponse(res, {
      statusCode: 200,
      message: "JWT created for user successfully",
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUser, deleteUser, processRegister };
