import express from 'express'

const authController = require('../controllers/authController')

const authRouter = express.Router()

// Define the routes
authRouter.post('/renewAccess', authController.renewAccess)
authRouter.post('/signUp', authController.signUp)
authRouter.post('/adminSignIn', authController.adminSignIn)
authRouter.post('/signIn', authController.signIn)

export default authRouter
