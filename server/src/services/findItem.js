const mongoose = require("mongoose");
const createHttpError = require("http-errors");

const findItemById = async (Model, id, options = {}) => {
    try {
        const item = await Model.findById(id, options);
        if (!item) throw createHttpError(404, `No ${Model.modelName} found by this id.`); 
        return item;
      } catch (error) {
        // handle mongoose error
        if (error instanceof mongoose.Error) {
          throw createHttpError(400, `Invalid ${Model.modelName} id.`);
        }
        throw error;
      }
}

module.exports = { findItemById };