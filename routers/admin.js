const express = require('express')
const {memoryStorage} = require('multer')
const multer = require('multer')
const {
  otpController,
  adminController,
  userController
} = require('../controllers')
const auth = require('../middlewares/auth')
const encrypt = require('../middlewares/encrypt')

const admin = express.Router()

const upload = multer({
  storage: memoryStorage()
})

admin.get('/pending-post', adminController.getPendingPost)

admin.post('/login', adminController.login)
admin.post('/logout', auth.verifyAdmin, userController.logout)

admin.post(
  '/lock-account/:username',
  auth.verifyAdmin,
  adminController.lockAccount
)

admin.post(
  '/approve-post/:post_id',
  auth.verifyAdmin,
  adminController.approvePost
)

admin.post('/deny-post/:post_id', auth.verifyAdmin, adminController.denyPost)

admin.post(
  '/delete-post/:post_id',
  auth.verifyAdmin,
  adminController.deletePost
)

module.exports = admin
