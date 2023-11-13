const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const { findOneItem } = require("./findItem");

const updateItem = async (Model, filter, updates, options) => {
  try {
    await findOneItem(Model, filter);
    const updatedItem = await Model.findOneAndUpdate(filter, updates, options);
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

module.exports = { updateItem }