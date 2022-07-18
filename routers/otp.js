const express = require('express')

const OTPController = require('../controllers/OTPController')

const otp = express.Router()

otp.post('/create', OTPController.createOTP)
otp.post('/verify', OTPController.verifyOTP)

module.exports = otp
