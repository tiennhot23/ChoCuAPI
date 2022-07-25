const express = require('express')
const {categoryController} = require('../controllers')

const category = express.Router()

category.get('/', categoryController.getCategories)

category.get(
  '/list-details/:category_id',
  categoryController.getCategoryDetails
)

category.post('/', categoryController.addCategory)

category.put('/:category_id', categoryController.updateCategory)

category.put('/add-details/:category_id', categoryController.addDetails)

module.exports = category
