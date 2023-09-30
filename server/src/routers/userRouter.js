// router for 'api/users'

const express = require('express')
const { getUsers, getUser } = require('../controllers/userController')


const userRouter = express.Router()

// api/users
userRouter.get('/', getUsers)
// api/users/:id
userRouter.get('/:id', getUser)

// api/users/test
userRouter.get('/test', (req, res) => {
  res.send('testing router')
})

module.exports = userRouter;