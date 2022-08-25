const {servicesModule} = require('../modules')
const {helper, utils, messages} = require('../common')
const {BadRequest} = require('../utils/Errors')

const services = {}

services.getPostTurnServices = async (req, res, next) => {
  try {
    res.success({
      data: await servicesModule.getPostTurnServices()
    })
  } catch (e) {
    next(e)
  }
}

module.exports = services
