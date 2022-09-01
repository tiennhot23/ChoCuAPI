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

admin.get('/all-post', adminController.getAllPost)
admin.get('/pending-post', adminController.getPendingPost)
admin.get('/all-user', adminController.getAllUser)
admin.post('/service-revenue', adminController.getServicesRevenue)

admin.post('/login', adminController.login)
admin.post('/logout', auth.verifyAdmin, userController.logout)

admin.post(
  '/lock-account/:username',
  auth.verifyAdmin,
  adminController.lockAccount
)

admin.post(
  '/unlock-account/:username',
  auth.verifyAdmin,
  adminController.unlockAccount
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

admin.get('/reports', adminController.getReports)
admin.post('/clear-report/:post_id', adminController.clearPostReports)

module.exports = admin
