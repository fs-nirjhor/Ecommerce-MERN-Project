// router for 'api/auth'

const express = require("express");
const { handleLogin, handleLogout, handleRefreshToken } = require("../controllers/authController");
const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");
const { validateUserLogin } = require("../validators/userValidator");
const runValidations = require("../validators");
const authRouter = express.Router();

// api/auth/login
authRouter.post('/login', isLoggedOut, validateUserLogin, runValidations, handleLogin);
// api/auth/logout
authRouter.post('/logout', isLoggedIn, handleLogout);
// api/auth/refresh-token
authRouter.get('/refresh-token', handleRefreshToken);


module.exports = authRouter;