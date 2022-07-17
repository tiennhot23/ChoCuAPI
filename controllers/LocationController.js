const LocationModule = require('../modules/LocationModule')

const {Err, Response} = require('../models')
const {messages} = require('../common')

const location = {}

location.getAllLocation = async (req, res, next) => {
  try {
    next({data: await LocationModule.get_all()})
  } catch (e) {
    next(new Err(e.message, 500, e.constraint))
  }
}

location.getProvinces = async (req, res, next) => {
  try {
    next({data: await LocationModule.get_provinces()})
  } catch (e) {
    next(new Err(e.message, 500, e.constraint))
  }
}

location.getDistricts = async (req, res, next) => {
  try {
    let province = req.query.province
    if (!province)
      return next(new Err(messages.location.province_required, 400, null))
    next({data: await LocationModule.get_ditricts(province)})
  } catch (e) {
    next(new Err(e.message, 500, e.constraint))
  }
}

location.getWards = async (req, res, next) => {
  try {
    let district = req.query.district
    if (!district)
      return next(new Err(messages.location.district_required, 400, null))
    next({data: await LocationModule.get_wards(district)})
  } catch (e) {
    next(new Err(e.message, 500, e.constraint))
  }
}

module.exports = location
