const express = require('express')

const {otpController} = require('../controllers')

const otp = express.Router()

otp.post('/create', otpController.createOTP)
otp.post('/verify', otpController.verifyOTP)

module.exports = otp
