// manage getting all user data

const createHttpError = require("http-errors");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const {
  findItemById,
  findOneItem,
  findAllUsers,
} = require("../services/findItem");
const deleteImage = require("../helper/deleteImage");
const { createJwt } = require("../helper/manageJWT");
const {
  jwtActivationKey,
  clientUrl,
  jwtResetPasswordKey,
} = require("../secret");
const jwt = require("jsonwebtoken");
const sendMail = require("../helper/useNodemailer");
const { defaultUserImagePath, maxImageSize } = require("../config/config");
const { deleteItem } = require("../services/deleteItem");
const {
  updateIsBanned,
  updateItem,
  updateItemById,
  updateManyKey,
} = require("../services/updateItem");
const useCloudinary = require("../helper/useCloudinary");
const { createItem } = require("../services/createItem");

const handleGetAllUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const { users, count, pagination } = await findAllUsers(
      search,
      limit,
      page
    );
    return successResponse(res, {
      statusCode: 200,
      message: `${users.length} / ${count} users returned`,
      payload: { users, pagination },
    });
  } catch (error) {
    next(error);
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
    const filter = { _id: id };
    const options = { password: 0 };
    const deletedUser = await deleteItem(
      User,
      filter,
      defaultUserImagePath,
      options
    );
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
    // TODO: upload image as server path or Buffer string or cloudinary path 
    /* const image = req.file
    ? req.file.buffer.toString("base64")
    : defaultUserImageBuffer; */ // buffer image set up
    //const image = req.file?.path || defaultUserImagePath; // server image setup
    const path = req.file?.path || defaultUserImagePath;
    const image = await useCloudinary(path, "users");
    const newUser = { ...req.body, image };
    const { name, email } = newUser;
    const isRegistered = await User.exists({ email: email });
    if (isRegistered)
      throw createHttpError(409, "Email already be registered. Please login.");
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
    const user = await createItem(User, decoded);
    return successResponse(res, {
      statusCode: 200,
      message: `User activated successfully`,
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
    const updateKeys = ["name", "phone", "address", "image"];
    const filter = { _id: id };
    const options = { select: "-password" };
    const updatedUser = await updateManyKey(
      User,
      filter,
      updateKeys,
      req,
      "users",
      defaultUserImagePath,
      options
    );
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
    const updatedUser = await updateItemById(User, id, updates, updateOptions);
    if (!updatedUser) throw new Error("Password can't be updated");
    return successResponse(res, {
      statusCode: 200,
      message: "password is updated successfully",
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
    const mailInfo = await sendMail(mailData);
    if (!mailInfo) throw new Error("Couldn't send mail");
    return successResponse(res, {
      statusCode: 200,
      message: `Reset password mail sent to ${email}`,
      // TODO: remove token from payload
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
    const updatedUser = await updateItemById(
      User,
      decoded.id,
      updates,
      updateOptions
    );
    if (!updatedUser) throw new Error("Password can't be updated");
    return successResponse(res, {
      statusCode: 200,
      message: `Password reset successfully`,
    });
  } catch (error) {
    next(error);
  }
};

const handleUserStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const action = req.body.action;
    const bannedUser = await updateIsBanned(id, action);
    return successResponse(res, {
      statusCode: 200,
      message: `${bannedUser.name} is ${
        bannedUser.isBanned ? "banned" : "unbanned"
      } successfully`,
      payload: { bannedUser },
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
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
  handleUserStatus,
};
