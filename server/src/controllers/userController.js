// manage getting all user data

const createHttpError = require("http-errors");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findItemById, findOneItem } = require("../services/findItem");
const deleteImage = require("../helper/deleteImage");
const { createJwt } = require("../helper/manageJWT");
const {
  jwtActivationKey,
  clientUrl,
  jwtResetPasswordKey,
} = require("../secret");
const jwt = require("jsonwebtoken");
const sendMail = require("../helper/useNodemailer");
const {
  defaultUserImagePath,
  defaultUserImageBuffer,
  maxImageSize,
} = require("../config/config");

const handleGetAllUsers = async (req, res, next) => {
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
    if (!users || users.length === 0)
      throw createHttpError(404, "No users found"); // this error will be catch()
    return successResponse(res, {
      statusCode: 200,
      message: `${users.length} / ${count} users returned`,
      payload: { users, pagination },
    });
  } catch (error) {
    next(error); // next refers to error handler.
  }
};

const handleGetUserById = async (req, res, next) => {
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

const handleDeleteUser = async (req, res, next) => {
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
const handleProcessRegister = async (req, res, next) => {
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
      <p>Click here to <a href='${clientUrl}/api/users/activate/${token}' target="_blank" rel="noopener noreferrer">activate your email</a></p>
      `,
    };
    const mailInfo = await sendMail(mailData);
    if (!mailInfo) throw new Error("Couldn't send mail");
    return successResponse(res, {
      statusCode: 200,
      message: `Verification mail sent to ${email}`,
    });
  } catch (error) {
    next(error);
  }
};
const handleActivateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    // verify jwt token
    const decoded = jwt.verify(token, jwtActivationKey);
    if (!decoded) {
      throw createHttpError(400, "JWT token is invalid or expired");
    }
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
const handleUpdateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userById = await findItemById(User, id, { password: 0 });
    const updates = {};
    const updateOptions = { new: true, runValidators: true, context: "query" };
    const updateKeys = ["name", "phone", "address"];
    // user is added from isLoggedIn middleware
    const { user, ...data } = req.body;
    for (let key in data) {
      if (!updateKeys.includes(key)) {
        throw createHttpError(400, `${key} can\'t be updated`);
      }
      if (data[key] === userById[key]) {
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
    if (!updatedUser) {
      throw new Error("User can't be updated");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "User updated successfully",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};
const handleBanUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await findItemById(User, id, { password: 0 });
    if (user.isBanned)
      throw createHttpError(409, `${user.name} is already banned`);
    const updates = { isBanned: true };
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
const handleUnbanUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await findItemById(User, id, { password: 0 });
    if (!user.isBanned)
      throw createHttpError(409, `${user.name} is not banned`);
    const updates = { isBanned: false };
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
const handleUpdatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const id = req.params.id;
    const user = await findItemById(User, id);
    //? is password matched
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw createHttpError(403, "Incorrect current password");
    }
    if (newPassword === currentPassword) {
      throw createHttpError(403, "Password already in use");
    }
    const updates = { $set: { password: newPassword } };
    const updateOptions = { new: true, runValidators: true, context: "query" };
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      updateOptions
    ).select("-password");
    if (!updatedUser) throw new Error("Password can't be updated");
    return successResponse(res, {
      statusCode: 200,
      message: "password is updated successfully",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};
const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    //? is user exist
    const user = await findOneItem(User, { email });

    // create jwt token
    const token = createJwt({ id: user._id }, jwtResetPasswordKey, "10m");
    // send verification email
    const mailData = {
      email,
      subject: "Reset Password Email",
      html: `
      <h2>Hello ${user.name}</h2>
      <p>Click here to <a href='${clientUrl}/api/users/reset-password/${token}' target="_blank" rel="noopener noreferrer">Reset your password</a></p>
      `,
    };
    // TODO: comment out mailInfo for testing purposes. remove it later
    //const mailInfo = {};
    const mailInfo = await sendMail(mailData);
    if (!mailInfo) throw new Error("Couldn't send mail");
    return successResponse(res, {
      statusCode: 200,
      message: `Reset password mail sent to ${email}`,
      // TODO: remove token from payload. its security issue. here is for testing.
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};
const handleResetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    // verify jwt token
    const decoded = await jwt.verify(token, jwtResetPasswordKey);
    if (!decoded) {
      throw createHttpError(400, "JWT token is invalid or expired");
    }
    // reset password
    const updates = { password: newPassword };
    const updateOptions = { new: true, runValidators: true, context: "query" };
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      updates,
      updateOptions
    ).select("-password");
    if (!updatedUser) throw new Error("Password can't be updated");
    return successResponse(res, {
      statusCode: 200,
      message: `Password reset successfully`,
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleDeleteUser,
  handleProcessRegister,
  handleActivateUserAccount,
  handleUpdateUser,
  handleBanUser,
  handleUnbanUser,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
};
