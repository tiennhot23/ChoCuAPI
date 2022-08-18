const express = require('express')

const {notifyController} = require('../controllers')

const notify = express.Router()

notify.get('/send', notifyController.sendSingle)

module.exports = notify
