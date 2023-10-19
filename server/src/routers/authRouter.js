// router for 'api/auth'

const express = require("express");
const { handleLogin, handleLogout } = require("../controllers/authController");
const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");
const { validateUserLogin } = require("../validators/userValidator");
const runValidations = require("../validators");
const authRouter = express.Router();

// api/auth/login
authRouter.post('/login', isLoggedOut, validateUserLogin, runValidations, handleLogin);
authRouter.post('/logout', isLoggedIn, handleLogout);


module.exports = authRouter;