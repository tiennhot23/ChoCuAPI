const express = require('express')
const {memoryStorage} = require('multer')
const multer = require('multer')
const {detailsController} = require('../controllers')

const details = express.Router()

const upload = multer({
  storage: memoryStorage()
})

details.get('/', detailsController.getDetails)

details.post('/', upload.any('details_icon'), detailsController.addDetails)

details.post(
  '/update/:details_id',
  upload.any('details_icon'),
  detailsController.updateDetails
)

details.post('/delete/:details_id', detailsController.deleteDetails)

module.exports = details
