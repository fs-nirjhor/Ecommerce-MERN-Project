// router for 'api/auth'

const express = require("express");
const { handleLogin } = require("../controllers/authController");
const authRouter = express.Router();

// api/auth/login
authRouter.post('/login', handleLogin);


module.exports = authRouter;