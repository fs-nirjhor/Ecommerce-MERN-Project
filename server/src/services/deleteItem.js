const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const { findOneItem } = require("./findItem");

const deleteItem = async (Model, data, options = {}) => {
  try {
    if (typeof data !== "object" || Object.keys(data).length === 0) {
      throw new Error(
        `Please provide data as object to delete ${Model.modelName}`
      );
    }
    await findOneItem(Model, data, options);
    const deletedItem = await Model.findOneAndDelete(data, options)
    .select("-createdAt -updatedAt -__v");
    if (!deletedItem) {
      throw createHttpError(400, `Failed to delete this ${Model.modelName}`);
    }
    return deletedItem;
  } catch (error) {
    throw error;
  }
};

module.exports = { deleteItem };
