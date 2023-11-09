// MongoDB connection with Mongoose 

const mongoose = require("mongoose");
const { databaseUrl } = require("../secret");
const logger = require("../helper/winstonLogger");

const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(databaseUrl, options);
    logger.info("Database connected successfully");
    mongoose.connection.on("error", (error) => {
      logger.error(`Database Connection error`);
    });
  } catch (error) {
    logger.error(`Couldn't connect to Database`);
  }
};

module.exports = connectDB;
