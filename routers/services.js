const express = require('express')

const {servicesController} = require('../controllers')

const services = express.Router()

services.get('/', servicesController.getPostTurnServices)

services.post('/add', servicesController.addPostTurnServices)
services.post('/update/:service_id', servicesController.updatePostTurnServices)
services.post('/delete/:service_id', servicesController.removePostTurnService)

module.exports = services
