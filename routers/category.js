const express = require('express')
const {memoryStorage} = require('multer')
const multer = require('multer')
const {categoryController} = require('../controllers')

const category = express.Router()

const upload = multer({
  storage: memoryStorage()
})

category.get('/', categoryController.getCategories)

category.get(
  '/list-details/:category_id',
  categoryController.getCategoryDetails
)

category.post('/', upload.any('category_icon'), categoryController.addCategory)

category.put(
  '/:category_id',
  upload.any('category_icon'),
  categoryController.updateCategory
)

category.put('/add-details/:category_id', categoryController.addDetails)

module.exports = category
