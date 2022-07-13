const LocationModule = require('../modules/LocationModule')

const {Err, Response} = require('../models')

const location = {}

location.getAllProvices = async (req, res, next) => {
  try {
    next({data: await LocationModule.get_all_provinces()})
  } catch (e) {
    next(new Err(e.message, 500, e.constraint))
  }
}

location.getAllDistrict = async (req, res, next) => {
  try {
    next({data: await LocationModule.get_all_districts()})
  } catch (e) {
    next(new Err(e.message, 500, e.constraint))
  }
}

module.exports = location
