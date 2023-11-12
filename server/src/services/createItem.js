const createHttpError = require("http-errors");
const mongoose = require("mongoose");

const createItem = async (Model, data) => {
    try {
    if (typeof data !== "object" || Object.keys(data).length === 0) {
      throw new Error(
        `Please provide data as object to create ${Model.modelName}`
      );
    }
    const item = await Model.create(data);
    return item;
  } catch (error) {
      // handle mongoose error
      if (error.code === 11000) {
        throw createHttpError(
          409,
          `This ${Model.modelName} is already created.`
        );
      }
        if (error instanceof mongoose.Error) {
          throw createHttpError(400, `Failed to create ${Model.modelName}.`);
        }
    throw error;
  }
};

module.exports = { createItem };
