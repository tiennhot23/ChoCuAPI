const {helper, utils, messages} = require('../common')
const {role} = require('../common/constants')
const {detailsModule, fileModule} = require('../modules')
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
  let isUploadFile =
    req.files &&
    req.files.length > 0 &&
    req.files[0].fieldname === 'details_icon'
  try {
    if (!helper.isValidObject(details_title))
      throw new BadRequest(messages.details.title_required)
    if (!helper.isValidObject(details_icon) && !isUploadFile)
      throw new BadRequest(messages.details.icon_required)

    if (isUploadFile) {
      if (!req.files[0]['mimetype'].includes('image'))
        throw new BadRequest(messages.common.image_invalid)
    }

    let details = await detailsModule.add({
      details_title,
      details_icon,
      default_content,
      editable
    })

    if (helper.isValidObject(details)) {
      if (isUploadFile) {
        details_icon = await fileModule.upload_single(
          req.files[0],
          'details/',
          details.details_id
        )
        details = await detailsModule.update({
          details_id: details.details_id,
          details_title: null,
          details_icon,
          default_content: null,
          editable: null
        })
      }

      res.success({
        message: messages.common.add_success,
        data: details
      })
    } else throw new GeneralError(messages.common.something_wrong)
  } catch (e) {
    next(e)
  }
}

controller.updateDetails = async (req, res, next) => {
  let {details_title, details_icon, default_content, editable} = req.body
  let {details_id} = req.params
  let isUploadFile =
    req.files &&
    req.files.length > 0 &&
    req.files[0].fieldname === 'details_icon'
  try {
    if (isUploadFile) {
      if (!req.files[0]['mimetype'].includes('image'))
        throw new BadRequest(messages.common.image_invalid)
      details_icon = await fileModule.upload_single(
        req.files[0],
        'details/',
        details_id
      )
    }

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

controller.deleteDetails = async (req, res, next) => {
  let {details_id} = req.params
  try {
    res.success({
      message: messages.common.delete_success,
      data: await detailsModule.delete({details_id})
    })
  } catch (e) {
    next(e)
  }
}

module.exports = controller
