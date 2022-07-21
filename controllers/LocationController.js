const {locationModule} = require('../modules')

const {messages} = require('../common')
const {BadRequest} = require('../utils/Errors')

const location = {}

location.getAllLocation = async (req, res, next) => {
  try {
    res.success({data: await locationModule.get_all()})
  } catch (e) {
    next(e)
  }
}

location.getProvinces = async (req, res, next) => {
  try {
    res.success({data: await locationModule.get_provinces()})
  } catch (e) {
    next(e)
  }
}

location.getDistricts = async (req, res, next) => {
  try {
    let province = req.query.province
    if (!province) throw new BadRequest(messages.location.province_required)
    res.success({data: await locationModule.get_ditricts(province)})
  } catch (e) {
    next(e)
  }
}

location.getWards = async (req, res, next) => {
  try {
    let district = req.query.district
    if (!district) throw new BadRequest(messages.location.district_required)
    res.success({data: await locationModule.get_wards(district)})
  } catch (e) {
    next(e)
  }
}

module.exports = location
