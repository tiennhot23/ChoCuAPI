const express = require('express')

const {servicesController} = require('../controllers')

const services = express.Router()

services.get('/post-turn-services', servicesController.getPostTurnServices)

module.exports = services
