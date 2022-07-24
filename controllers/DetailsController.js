const {detailsController} = require('.')
const {helper, utils, messages} = require('../common')
const {role} = require('../common/constants')
const {detailsModule} = require('../modules')
const {
  BadRequest,
  GeneralError,
  Forbidden,
  NotFound
} = require('../utils/Errors')

const controller = {}

controller.getDetails = async (req, res, next) => {
  try {
    res.success({
      data: await detailsModule.get_all()
    })
  } catch (e) {
    next(e)
  }
}

controller.addDetails = async (req, res, next) => {
  let {details_title, details_icon, default_content, editable} = req.body
  try {
    if (!helper.isValidObject(details_title))
      throw new BadRequest(messages.details.title_required)
    if (!helper.isValidObject(details_icon))
      throw new BadRequest(messages.details.icon_required)

    res.success({
      message: messages.common.add_success,
      data: await detailsModule.add({
        details_title,
        details_icon,
        default_content,
        editable
      })
    })
  } catch (e) {
    next(e)
  }
}

controller.updateDetails = async (req, res, next) => {
  let {details_title, details_icon, default_content, editable} = req.body
  let {details_id} = req.params
  try {
    let details = await detailsModule.update({
      details_id,
      details_title,
      details_icon,
      default_content,
      editable
    })
    if (!helper.isValidObject(details))
      throw new NotFound(messages.details.not_found)

    res.success({
      message: messages.common.update_success,
      data: details
    })
  } catch (e) {
    next(e)
  }
}

module.exports = controller
