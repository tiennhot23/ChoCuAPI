const express = require('express')
const {memoryStorage} = require('multer')
const multer = require('multer')
const {postController} = require('../controllers')
const auth = require('../middlewares/auth')
const upload = multer({
  storage: memoryStorage()
})

const post = express.Router()

post.get('/', postController.getPosts)

post.post(
  '/create-post',
  auth.verifyUser,
  upload.array('picture', 5),
  postController.createPost
)

module.exports = post
