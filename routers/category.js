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

category.post(
  '/update/:category_id',
  upload.any('category_icon'),
  categoryController.updateCategory
)

category.post('/delete/:category_id', categoryController.deleteCategory)

category.post('/add-details/:category_id', categoryController.addDetails)
category.post('/remove-details/:category_id', categoryController.removeDetails)

module.exports = category
