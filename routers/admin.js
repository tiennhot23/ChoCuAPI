const express = require('express')
const {memoryStorage} = require('multer')
const multer = require('multer')
const {otpController, adminController} = require('../controllers')
const auth = require('../middlewares/auth')
const encrypt = require('../middlewares/encrypt')

const admin = express.Router()

const upload = multer({
  storage: memoryStorage()
})

admin.post('/login', adminController.login)

admin.put(
  '/approve-post/:post_id',
  auth.verifyAdmin,
  adminController.approvePost
)

admin.put('/deny-post/:post_id', auth.verifyAdmin, adminController.denyPost)

module.exports = admin
