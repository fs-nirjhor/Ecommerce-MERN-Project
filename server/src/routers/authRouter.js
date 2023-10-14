// router for 'api/auth'

const express = require("express");
const { handleLogin, handleLogout } = require("../controllers/authController");
const authRouter = express.Router();

// api/auth/login
authRouter.post('/login', handleLogin);
authRouter.post('/logout', handleLogout);


module.exports = authRouter;