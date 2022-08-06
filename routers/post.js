const express = require('express')
const {memoryStorage} = require('multer')
const multer = require('multer')
const {postController} = require('../controllers')
const auth = require('../middlewares/auth')
const upload = multer({
  storage: memoryStorage()
})

const post = express.Router()

post.post('/', postController.getPosts)

post.get('/:post_id', postController.getPost)

post.post(
  '/create-post',
  auth.verifyUser,
  upload.array('picture', 5),
  postController.createPost
)

post.post('/end-post/:post_id', auth.verifyUser, postController.endPost)

module.exports = post
