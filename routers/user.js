const express = require('express')
const {otpController, userController} = require('../controllers')
const auth = require('../middlewares/auth')
const encrypt = require('../middlewares/encrypt')

const user = express.Router()

user.get('/:user_id', userController.getUserInfo)

user.get('/user-follow/:user_id', userController.getUserFollowStatistic)

user.get('/user-posts/:post_state/:user_id', userController.getUserPosts)

user.post(
  '/create-account',
  otpController.verifyAction,
  encrypt.hashPassword,
  userController.createAccount
)

user.post('/login', userController.login)

user.post('/logout', auth.verifyUser, userController.logout)

user.post(
  '/forgot-password',
  otpController.verifyAction,
  encrypt.hashPassword,
  userController.resetPassword
)

user.post('/add-user-payment', auth.verifyUser, userController.addUserPayment)

user.put('/update-info', auth.verifyUser, userController.updateInfo)

user.put(
  '/reset-password',
  auth.verifyUser,
  encrypt.hashPassword,
  userController.resetPassword
)

user.delete(
  '/remove-user-payment',
  auth.verifyUser,
  userController.removeUserPayment
)

module.exports = user
