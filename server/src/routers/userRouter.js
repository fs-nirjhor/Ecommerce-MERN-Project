//* router for 'api/users'

const express = require("express");
const {
  getUsers,
  getUser,
  deleteUser,
  processRegister,
  activateUserAccount,
  updateUser,
} = require("../controllers/userController");
const { validateUserRegistration } = require("../validators/userValidator");
const runValidations = require("../validators");
// TODO: image can be uploaded as string (save image to server and save path to database) or buffer (save image as buffer to database). Any one import should be choose here.
const upload = require("../middlewares/uploadBufferFile"); //buffer
const { isLoggedin } = require("../middlewares/auth");
// const upload = require("../middlewares/uploadFile");  //string

const userRouter = express.Router();

// api/users
userRouter.get("/", getUsers);
// api/users/:id
userRouter.get("/:id", isLoggedin, getUser);
userRouter.delete("/:id", isLoggedin, deleteUser);
userRouter.put("/:id", upload.single("image"), isLoggedin, updateUser);
// api/users/process-register
userRouter.post(
  "/process-register",
  upload.single("image"),
  validateUserRegistration,
  runValidations,
  processRegister
);
// api/users/activate
userRouter.post("/activate", activateUserAccount);
// api/users/test
userRouter.get("/test", (req, res) => {
  res.send("testing router");
});

module.exports = userRouter;
