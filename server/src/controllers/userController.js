const users = require("../models/userModel")
// const createError = require("http-errors");

const getUsers = (req, res, next) => {
  try {
    return res.status(200).json(users)
  } catch (error) {
    next(error) // next refers to error handler.
  }
}

module.exports = getUsers