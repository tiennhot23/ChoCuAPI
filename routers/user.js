const express = require('express')
const {otpController, userController} = require('../controllers')
const auth = require('../middlewares/auth')
const encrypt = require('../middlewares/encrypt')

const user = express.Router()

user.post(
  '/create-account',
  otpController.verifyAction,
  encrypt.hashPassword,
  userController.createAccount
)

user.post('/login', userController.login)

user.post('/logout', auth.verifyUser, userController.logout)

user.put('/update-info', auth.verifyUser, userController.updateInfo)

module.exports = user
