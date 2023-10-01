// router for 'api/users'

const express = require('express')
const { getUsers, getUser, deleteUser, processRegister } = require('../controllers/userController')


const userRouter = express.Router()

// api/users
userRouter.get('/', getUsers)
// api/users/:id
userRouter.get('/:id', getUser)
userRouter.delete('/:id', deleteUser)
// api/users/process-register
userRouter.post('/process-register', processRegister)

// api/users/test
userRouter.get('/test', (req, res) => {
  res.send('testing router')
})

module.exports = userRouter;