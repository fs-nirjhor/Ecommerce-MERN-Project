const createHttpError = require("http-errors");
const mongoose = require("mongoose");

const seedItems = async (Model, data) => {
  try {
    // clear existing items
    await Model.deleteMany({});
    // add new items
    const items = await Model.insertMany(data);
    return items;
  } catch (error) {
    if (error instanceof mongoose.Error) {
        throw createHttpError(400, `Failed to seed ${Model.modelName}.`);
      }
      throw error;
  }
};
module.exports = seedItems;