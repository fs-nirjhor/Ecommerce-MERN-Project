// seed api for "/api/seed"

const express = require('express');
const seedUser = require('../controllers/seedController');
const seedRouter = express.Router();

// api/seed/users
seedRouter.post('/users', seedUser)

module.exports = seedRouter;
