const express = require('express')

const {paymentController} = require('../controllers')

const payment = express.Router()

payment.get('/', paymentController.getPayments)

module.exports = payment
