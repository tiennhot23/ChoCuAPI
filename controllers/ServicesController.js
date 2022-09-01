const {servicesModule} = require('../modules')
const {helper, utils, messages} = require('../common')
const {BadRequest, NotFound} = require('../utils/Errors')

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

services.addPostTurnServices = async (req, res, next) => {
  try {
    let {service_name, post_turn, description, price} = req.body
    let data = await servicesModule.addPostTurnService({
      service_name,
      post_turn,
      description,
      price
    })
    if (!data) throw new NotFound('Không tìm thấy dịch vụ này')
    res.success({
      message: 'Thêm dịch vụ thành công',
      data: data
    })
  } catch (e) {
    next(e)
  }
}

services.updatePostTurnServices = async (req, res, next) => {
  try {
    let {service_name, post_turn, description, price} = req.body
    let {service_id} = req.params
    let data = await servicesModule.updatePostTurnService({
      service_id,
      service_name,
      post_turn,
      description,
      price
    })
    if (!data) throw new NotFound('Không tìm thấy dịch vụ này')
    res.success({
      message: 'Cập nhật dịch vụ thành công',
      data: data
    })
  } catch (e) {
    next(e)
  }
}

services.removePostTurnService = async (req, res, next) => {
  try {
    let {service_id} = req.params
    let data = await servicesModule.removePostTurnService({service_id})
    if (!data) throw new NotFound('Không tìm thấy dịch vụ này')
    res.success({
      message: 'Xoá dịch vụ thành công',
      data: data
    })
  } catch (e) {
    next(e)
  }
}

module.exports = services
