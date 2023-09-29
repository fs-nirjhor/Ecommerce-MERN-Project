const data = require("../data");
const User = require("../models/userModel");

const seedController = async(req, res, next) => {
 try {
    // deleting all existing users
    await User.deleteMany({});
    // adding new users
    const users = await User.insertMany(data.users);
    // successful response
    res.status(201).json(users)
 } catch (error) {
    next(error);
 }
}

module.exports = seedController;