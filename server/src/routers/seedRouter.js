// seed api for "/api/seed"

const express = require('express');
const seedUser = require('../controllers/seedController');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');
const seedRouter = express.Router();

// api/seed/users
seedRouter.post('/users', isLoggedIn, isAdmin, seedUser)

module.exports = seedRouter;
