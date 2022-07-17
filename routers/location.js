const express = require('express')

const LocationController = require('../controllers/LocationController')

const router = express.Router()

router.get('/provinces', LocationController.getProvinces)
router.get('/districts', LocationController.getDistricts)
router.get('/wards', LocationController.getWards)
router.get('/', LocationController.getAllLocation)

module.exports = router
