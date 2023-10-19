// manage getting all user data

const createHttpError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findItemById } = require("../services/findItem");
const deleteImage = require("../helper/deleteImage");
const { createJwt } = require("../helper/manageJWT");
const { jwtActivationKey, clientUrl } = require("../secret");
const jwt = require("jsonwebtoken");
const sendMail = require("../helper/useNodemailer");
const {
  defaultUserImagePath,
  defaultUserImageBuffer,
  maxImageSize,
} = require("../config/config");

const getAllUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 1;
    const userRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true }, // not equal
      $or: [
        // multiple filters
        { name: { $regex: userRegExp } },
        { email: { $regex: userRegExp } },
        { phone: { $regex: userRegExp } },
      ],
    };
    const options = { password: 0 }; // not include
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.find(filter).countDocuments();
    const pagination = {
      total: Math.ceil(count / limit),
      current: page,
      previous: page - 1 > 0 ? page - 1 : null,
      next: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
    };
    if (!users.length) throw createHttpError(404, "No users found"); // this error will be catch()
    return successResponse(res, {
      statusCode: 200,
      message: `${users.length} / ${count} users returned`,
      payload: { users, pagination },
    });
  } catch (error) {
    next(error); // next refers to error handler.
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findItemById(User, id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User returned successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    await findItemById(User, id, { password: 0 });
    const deletedUser = await User.findOneAndDelete({
      _id: id,
      isAdmin: false,
    });
    if (!deletedUser) throw createHttpError(400, "User cannot be deleted");
    // removing saved image of deleted user
    if (deletedUser.image !== defaultUserImagePath) {
      deleteImage(deletedUser.image);
    }
    return successResponse(res, {
      statusCode: 200,
      message: "User deleted successfully",
      payload: { deletedUser },
    });
  } catch (error) {
    next(error);
  }
};
const processRegister = async (req, res, next) => {
  try {
    // TODO: Here is double setup for upload image as String (path) or Buffer. Any one image should be choose here.
    //const image = req.file ? req.file.path : defaultUserImagePath;
    const image = req.file
      ? req.file.buffer.toString("base64")
      : defaultUserImageBuffer;
    const newUser = { ...req.body, image };
    const { name, email } = newUser;
    // check if email already registered
    const isRegistered = await User.exists({ email: email });
    // conflict error
    if (isRegistered)
      throw createHttpError(409, "Email already be registered. Please login.");
    // create jwt token
    const token = createJwt(newUser, jwtActivationKey, "10m");
    // send verification email
    const mailData = {
      email,
      subject: "Account Verification Email",
      html: `
      <h2>Hello ${name}</h2>
      <p>Click here to <a href='${clientUrl}/api/users/api/users/activate/${token}' target="_blank" rel="noopener noreferrer">activate your email</a></p>
      `,
    };
    // todo: comment out mailInfo for testing purposes. remove it later
    //const mailInfo = {};
    const mailInfo = await sendMail(mailData);
    if (!mailInfo) throw new Error("Couldn't send mail");
    return successResponse(res, {
      statusCode: 200,
      message: `Verification mail sent to ${email}`,
      // todo: remove token from payload. its security issue. here is for testing.
      payload: { token, /* mailInfo, */ newUser },
    });
  } catch (error) {
    next(error);
  }
};
const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    // verify jwt token
    var decoded = jwt.verify(token, jwtActivationKey);
    // register new user to database
    const user = await User.create(decoded);
    return successResponse(res, {
      statusCode: 200,
      message: `User verified successfully`,
      payload: { user },
    });
  } catch (error) {
    // check if user is already registered
    if (error.name === "MongoServerError") {
      next(createHttpError(400, "Email already registered. Please login."));
      return;
    }
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await findItemById(User, id, { password: 0 });
    const updates = {};
    const updateOptions = { new: true, runValidators: true, context: "query" };
    const updateKeys = ["name", "password", "phone", "address"];
    const data = req.body;
    for (let key in data) {
      if (!updateKeys.includes(key)) {
        throw createHttpError(400, `${key} can\'t be updated`);
      }
      if (data[key] === user[key]) {
        throw createHttpError(409, `${key} is already updated`);
      }
      updates[key] = data[key];
    }
    const image = req.file;
    if (image) {
      if (image.size > maxImageSize) {
        throw new Error(
          `Image size can\'t exceed ${maxImageSize / 1024 / 1024}MB.`
        );
      }
      updates.image = image.buffer.toString("base64");
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      updateOptions
    ).select("-password");
    if (!updatedUser) throw new Error("User can't be updated");
    return successResponse(res, {
      statusCode: 200,
      message: "User updated successfully",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};
const bannedUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await findItemById(User, id, { password: 0 });
    if (user.isBanned) throw createHttpError(409, `${user.name} is already banned`);
    const updates = {isBanned: true};
    const updateOptions = { new: true, runValidators: true, context: "query" };
    const bannedUser = await User.findByIdAndUpdate(
      id,
      updates,
      updateOptions
    ).select("-password");
    if (!bannedUser) throw new Error(`${user.name} can't be banned`);
    return successResponse(res, {
      statusCode: 200,
      message: `${user.name} is banned successfully`,
      payload: { bannedUser },
    });
  } catch (error) {
    next(error);
  }
};
const unbannedUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await findItemById(User, id, { password: 0 });
    if (!user.isBanned) throw createHttpError(409, `${user.name} is not banned`);
    const updates = {isBanned: false};
    const updateOptions = { new: true, runValidators: true, context: "query" };
    const unbannedUser = await User.findByIdAndUpdate(
      id,
      updates,
      updateOptions
    ).select("-password");
    if (!bannedUser) throw new Error(`${user.name} can't be unbanned`);
    return successResponse(res, {
      statusCode: 200,
      message: `${user.name} is unbanned successfully`,
      payload: { unbannedUser },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  processRegister,
  activateUserAccount,
  updateUser,
  bannedUser,
  unbannedUser,
};
