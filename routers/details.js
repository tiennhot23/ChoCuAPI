const express = require('express')
const {detailsController} = require('../controllers')

const details = express.Router()

details.get('/', detailsController.getDetails)

details.post('/', detailsController.addDetails)

details.put('/:details_id', detailsController.updateDetails)

module.exports = details
