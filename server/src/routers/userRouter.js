//* router for 'api/users'

const express = require("express");
const {
  getAllUsers,
  getUserById,
  deleteUser,
  processRegister,
  activateUserAccount,
  updateUser,
  bannedUser,
  unbannedUser,
} = require("../controllers/userController");
const { validateUserRegistration } = require("../validators/userValidator");
const runValidations = require("../validators");
// TODO: image can be uploaded as string (save image to server and save path to database) or buffer (save image as buffer to database). Any one import should be choose here.
const upload = require("../middlewares/uploadBufferFile"); //buffer
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
// const upload = require("../middlewares/uploadFile");  //string

const userRouter = express.Router();

// api/users
userRouter.get("/", isLoggedIn, isAdmin, getAllUsers);
// api/users/:id
userRouter.get("/:id", isLoggedIn, getUserById);
userRouter.delete("/:id", isLoggedIn, deleteUser);
userRouter.put("/:id", upload.single("image"), isLoggedIn, updateUser);
// api/users/process-register
userRouter.post(
  "/process-register",
  upload.single("image"),
  isLoggedOut,
  validateUserRegistration,
  runValidations,
  processRegister
);
// api/users/activate
userRouter.post("/activate", isLoggedOut, activateUserAccount);
// api/users/banned/:id
userRouter.put("/banned/:id", isLoggedIn, isAdmin, bannedUser)
// api/users/unbanned/:id
userRouter.put("/unbanned/:id", isLoggedIn, isAdmin, unbannedUser)
// api/users/test
userRouter.get("/test", (req, res) => {
  res.send("testing router");
});

module.exports = userRouter;
