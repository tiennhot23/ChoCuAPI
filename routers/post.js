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

post.get('/', auth.verifyUser, postController.getUserPosts)

post.get('/:post_id', postController.getPost)

post.get('/rating/:post_id', postController.getAllRating)

post.post(
  '/create-post',
  auth.verifyUser,
  upload.array('picture', 5),
  postController.createPost
)

post.post(
  '/edit-post/:post_id',
  auth.verifyUser,
  upload.array('picture', 5),
  postController.editPost
)

post.post('/end-post/:post_id', auth.verifyUser, postController.endPost)

post.post('/repost-post/:post_id', auth.verifyUser, postController.repostPost)

post.post('/report-post/:post_id', postController.reportPost)

module.exports = post
