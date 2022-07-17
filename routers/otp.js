const express = require('express')

const OTPController = require('../controllers/OTPController')

const otpRouter = express.Router()

otpRouter.post('/create', OTPController.createOTP)
otpRouter.post('/verify', OTPController.verifyOTP)

module.exports = otpRouter
