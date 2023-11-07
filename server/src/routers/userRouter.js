//* router for 'api/users'

const express = require("express");
const {
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
} = require("../controllers/userController");
const {
  validateUserRegistration,
  validateUpdatePassword,
  validateForgetPassword,
  validateResetPassword,
} = require("../validators/userValidator");
const runValidations = require("../validators");
// TODO: image can be uploaded as string (save image to server and save path to database) or buffer (save image as buffer to database). Any one import should be choose here.
const upload = require("../middlewares/uploadBufferFile"); //buffer
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
// const upload = require("../middlewares/uploadFile");  //string

const userRouter = express.Router();

// api/users
userRouter.get("/", isLoggedIn, isAdmin, handleGetAllUsers);
// api/users/process-register
userRouter.post(
  "/process-register",
  upload.single("image"),
  isLoggedOut,
  validateUserRegistration,
  runValidations,
  handleProcessRegister
);
// api/users/activate
userRouter.post("/activate", isLoggedOut, handleActivateUserAccount);
// api/users/forget-password
userRouter.post(
  "/forget-password",
  validateForgetPassword,
  runValidations,
  handleForgetPassword
);
// api/users/reset-password
userRouter.put(
  "/reset-password",
  validateResetPassword,
  runValidations,
  handleResetPassword
);
// api/users/update-password/:id (validated mongoose id)
userRouter.put(
  "/update-password/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  validateUpdatePassword,
  runValidations,
  handleUpdatePassword
);
// api/users/ban/:id
userRouter.put("/ban/:id([0-9a-fA-F]{24})", isLoggedIn, isAdmin, handleBanUser);
// api/users/unban/:id
userRouter.put(
  "/unban/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  isAdmin,
  handleUnbanUser
);

// api/users/:id
userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, handleGetUserById);
userRouter.delete("/:id([0-9a-fA-F]{24})", isLoggedIn, handleDeleteUser);
userRouter.put(
  "/:id([0-9a-fA-F]{24})",
  upload.single("image"),
  isLoggedIn,
  handleUpdateUser
);
// api/users/test
userRouter.get("/test", (req, res) => {
  res.send("testing router");
});

module.exports = userRouter;
