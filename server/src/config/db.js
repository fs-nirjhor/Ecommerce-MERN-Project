// MongoDB connection with Mongoose 

const mongoose = require("mongoose");
const { databaseUrl } = require("../secret");

const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(databaseUrl, options);
    console.log("Database connected successfully.");
    mongoose.connection.on("error", (error) => {
      console.error(`Database Connection error`);
    });
  } catch (error) {
    console.error(`Couldn't connect to Database`);
  }
};

module.exports = connectDB;
