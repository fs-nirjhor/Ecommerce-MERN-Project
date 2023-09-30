const mongoose = require("mongoose");
const User = require("../models/userModel");
const createHttpError = require("http-errors");

const findUserById = async (id) => {
    try {
        const options = { password: 0 }; 
        const user = await User.findById(id, options);
        if (!user) throw createHttpError(404, "No user found by this id."); 
        return user;
      } catch (error) {
        // handle mongoose error
        if (error instanceof mongoose.Error) {
          throw createHttpError(400, "Invalid user id.");
        }
        throw error;
      }
}

module.exports = { findUserById };