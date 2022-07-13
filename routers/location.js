const express = require('express')

const LocationController = require('../controllers/LocationController')

const router = express.Router()

router.get('/provinces', LocationController.getAllProvices)
router.get('/districts', LocationController.getAllDistrict)

module.exports = router
