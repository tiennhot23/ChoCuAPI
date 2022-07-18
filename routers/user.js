const express = require('express')
const userController = require('../controllers/UserController')
const encrypt = require('../middlewares/encrypt')

const user = express.Router()

user.post('/create-account', encrypt.hashPassword, userController.createAccount)

module.exports = user
