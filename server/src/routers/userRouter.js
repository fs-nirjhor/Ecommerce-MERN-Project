// router for 'api/users'

const express = require('express')
const userController = require('../controllers/userController')

const userRouter = express.Router()

// api/users
userRouter.get('/', userController)

// api/users/test
userRouter.get('/test', (req, res) => {
  res.send('testing router')
})

module.exports = userRouter;