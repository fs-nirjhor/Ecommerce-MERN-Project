const mongoose = require("mongoose");
const createHttpError = require("http-errors");

const findItemById = async (Model, id, options = {}) => {
  try {
    const item = await Model.findById(id, options);
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
      throw new Error("Please provide data as object to find one item");
    }
    const item = await Model.findOne( data , options);
    //console.log(item, data)
    if (!item) {
      throw createHttpError(404, `No ${Model.modelName} found with this ${Object.keys(data)}.`);
    }
    return item;
  } catch (error) {
    // handle mongoose error
    if (error instanceof mongoose.Error) {
      throw createHttpError(400, `Invalid ${Model.modelName} key.`);
    }
    throw error;
  }
};

module.exports = { findItemById, findOneItem };
