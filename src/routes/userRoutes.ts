import express from 'express'

const userController = require('../controllers/userController')

const userRouter = express.Router()

// Define the routes
userRouter.get('/getUser', userController.getUser)
userRouter.get('/getUsers', userController.getUsers)
userRouter.put('/updateUser', userController.updateUser)
userRouter.delete('/deleteUser', userController.deleteUser)

export default userRouter
