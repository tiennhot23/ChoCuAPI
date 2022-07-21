const express = require('express')
const {otpController, userController} = require('../controllers')
const encrypt = require('../middlewares/encrypt')

const user = express.Router()

user.post(
  '/create-account',
  otpController.verifyAction,
  encrypt.hashPassword,
  userController.createAccount
)

module.exports = user
