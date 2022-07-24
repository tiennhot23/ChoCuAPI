const express = require('express')
const {categoryController} = require('../controllers')

const category = express.Router()

category.get('/', categoryController.getCategories)

category.post('/', categoryController.addCategory)

category.put('/:category_id', categoryController.updateCategory)

module.exports = category
