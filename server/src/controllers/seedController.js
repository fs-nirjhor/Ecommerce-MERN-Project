const fakeData = require("../fakeData");
const User = require("../models/userModel");

const seedUser = async(req, res, next) => {
 try {
    // deleting all existing users
    await User.deleteMany({});
    // adding new users
    const users = await User.insertMany(fakeData.users);
    // successful response
    res.status(201).json(users)
 } catch (error) {
    next(error);
 }
}

module.exports = seedUser;