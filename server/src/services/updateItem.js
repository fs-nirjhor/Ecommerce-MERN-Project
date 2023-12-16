const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const { findOneItem, findItemById } = require("./findItem");
const User = require("../models/userModel");

const updateItem = async (Model, filter, updates, options={}) => {
  try {
    await findOneItem(Model, filter);
    const updatedItem = await Model.findOneAndUpdate(filter, updates, options).select("-createdAt -updatedAt -__v").lean();
    if (!updatedItem) {
      throw createHttpError(400, "Failed to update");
    }
    return updatedItem;
  } catch (error) {
    // handle mongoose error
    if (error instanceof mongoose.Error) {
      throw createHttpError(400, `Failed to update this ${Model.modelName}.`);
    }
    throw error;
  }
};
const updateItemById = async (Model, id, updates, options={}) => {
  try {
    await findItemById(Model, id);
    const updatedItem = await Model.findByIdAndUpdate(id, updates, options).select("-createdAt -updatedAt -__v").lean();
    if (!updatedItem) {
      throw createHttpError(400, "Failed to update");
    }
    return updatedItem;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createHttpError(400, `Invalid ${Model.modelName} id.`);
    }
    throw error;
  }
};
const updateIsBanned = async (id, action) => {
  try {
    const user = await findItemById(User, id, { password: 0 });
    let status;
    switch (action) {
      case "ban":
        status = true;
        break;
      case "unban":
        status = false;
        break;
      default:
        throw createHttpError(400, `Invalid action (${action}). Only ban and unban are allowed`);
    }
    if (user.isBanned === status) {
      throw createHttpError(
        409,
        `${user.name} is already ${status ? "banned" : "unbanned"}`
      );
    }
    const update = { isBanned: status };
    const updateOptions = { new: true, runValidators: true, context: "query" };

    const bannedUser = await User.findByIdAndUpdate(
      id,
      update,
      updateOptions
    ).select("-password");
    if (!bannedUser) throw new Error(`Failed to ${action}`);
    return bannedUser;
  } catch (error) {
    throw error;
  }
};


module.exports = { updateItem, updateItemById, updateIsBanned };