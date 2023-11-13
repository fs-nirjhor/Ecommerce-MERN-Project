const mongoose = require("mongoose");
const createHttpError = require("http-errors");

const findItemById = async (Model, id, options = {}) => {
  try {
    const item = await Model.findById(id, options).lean();
    if (!item) {
      throw createHttpError(404, `No ${Model.modelName} found by this id.`);
    }
    return item;
  } catch (error) {
    // handle mongoose error
    if (error instanceof mongoose.Error) {
      throw createHttpError(400, `Invalid ${Model.modelName} id.`);
    }
    throw error;
  }
};

const findOneItem = async (Model, data, options = {}) => {
  try {
    if (typeof data !== "object" || Object.keys(data).length === 0) {
      throw new Error(
        `Please provide data as object to find one ${Model.modelName}`
      );
    }
    const item = await Model.findOne(data, options);
    if (!item) {
      throw createHttpError(
        404,
        `No ${Model.modelName} found with ${Object.keys(data)}.`
      );
    }
    return item;
  } catch (error) {
    // handle mongoose error
    if (error instanceof mongoose.Error) {
      throw createHttpError(400, `Failed to find this ${Model.modelName}.`);
    }
    throw error;
  }
};
const findAllItem = async (Model) => {
  try {
    const items = await Model.find()
      .select("-createdAt -updatedAt -__v")
      .lean();
    if (!items.length) {
      throw createHttpError(404, `${Model.modelName} not found`);
    }
    return items;
  } catch (error) {
    // handle mongoose error
    if (error instanceof mongoose.Error) {
      throw createHttpError(400, `Failed to fetch ${Model.modelName}.`);
    }
    throw error;
  }
};
const updateItem = async (Model, filter, updates, options) => {
  try {
    await findOneItem(Model, filter)
    const updatedItem = await Model.findOneAndUpdate(
      filter,
      updates,
      options
    );
    return updatedItem;
  } catch (error) {
    // handle mongoose error
    if (error instanceof mongoose.Error) {
      throw createHttpError(400, `Failed to update this ${Model.modelName}.`);
    }
    throw error;
  }
};

module.exports = { findItemById, findOneItem, findAllItem, updateItem };
