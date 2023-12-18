const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const User = require("../models/userModel");
const { setPagination } = require("../helper/managePagination");

const findItemById = async (Model, id, select = {}) => {
  try {
    const item = await Model.findById(id, select).lean();
    if (!item) {
      throw createHttpError(404, `No ${Model.modelName} found by this id.`);
    }
    return item;
  } catch (error) {
    // handle mongoose error
    if (error instanceof mongoose.Error.CastError) {
      throw createHttpError(400, `Invalid ${Model.modelName} id.`);
    }
    throw error;
  }
};

const findOneItem = async (Model, data, select = {}) => {
  try {
    if (typeof data !== "object" || Object.keys(data).length === 0) {
      throw new Error(
        `Please provide data as object to find one ${Model.modelName}`
      );
    }
    const item = await Model.findOne(data, select);
    if (!item) {
      throw createHttpError(
        404,
        `No ${Model.modelName} found with ${Object.keys(data)}.`
      );
    }
    return item;
  } catch (error) {
    throw error;
  }
};
const findAllUsers = async (search, limit, page) => {
  try {
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true }, // not admin
      // multiple filters
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const select = { password: 0 }; // not include
    const users = await User.find(filter, select)
      .limit(limit)
      .skip((page - 1) * limit)
      .select("-createdAt -updatedAt -__v");
    const count = await User.find(filter).countDocuments();
    const pagination = setPagination(count, limit, page);
    if (!users || users.length === 0) {
      throw createHttpError(404, "No users found");
    }
    return {users, count, pagination};
  } catch (error) {
    throw error;
  }
};

module.exports = { findItemById, findOneItem, findAllUsers };
