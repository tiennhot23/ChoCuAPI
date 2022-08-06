const express = require('express')
const {memoryStorage} = require('multer')
const multer = require('multer')
const {
  otpController,
  userController,
  dealController
} = require('../controllers')
const auth = require('../middlewares/auth')
const encrypt = require('../middlewares/encrypt')

const deal = express.Router()

const upload = multer({
  storage: memoryStorage()
})

deal.get('/sell-history', auth.verifyUser, dealController.getSellHistory)

deal.get('/buy-history', auth.verifyUser, dealController.getBuyHistory)

deal.get('/:deal_id', auth.verifyUser, dealController.getDeal)

deal.get('/rating/:deal_id', dealController.getRating)

deal.post('/create-deal/:post_id', auth.verifyUser, dealController.createDeal)

deal.post(
  '/update-deal-state/:deal_id',
  auth.verifyUser,
  dealController.updateDealState
)

deal.post('/rate-deal/:deal_id', auth.verifyUser, dealController.rateDeal)

module.exports = deal
