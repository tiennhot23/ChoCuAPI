const express = require('express')

const {locationController} = require('../controllers')

const router = express.Router()

// router.get('/', (req, res, next) => {
//   const data = require('./data-location.json')
//   //   let newData = []
//   //   newData = data.map((item) => {
//   //     return {
//   //       name: item.name,
//   //       districts: item.districts.map((item2) => {
//   //         return {
//   //           name: item2.name,
//   //           wards: item2.wards.map((item3) => {
//   //             return {
//   //               name: item3.name
//   //             }
//   //           })
//   //         }
//   //       })
//   //     }
//   //   })
//   res.json(data)
// })

router.get('/provinces', locationController.getProvinces)
router.get('/districts', locationController.getDistricts)
router.get('/wards', locationController.getWards)
router.get('/', locationController.getAllLocation)

module.exports = router
