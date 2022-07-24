const express = require('express')
const {postController} = require('../controllers')

const post = express.Router()

post.get('/', postController.getPosts)

module.exports = post
