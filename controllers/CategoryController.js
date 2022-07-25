const {helper, utils, messages} = require('../common')
const {role} = require('../common/constants')
const {categoryModule, fileModule} = require('../modules')
const cateModule = require('../modules/CategoryModule')
const {
  BadRequest,
  GeneralError,
  Forbidden,
  NotFound
} = require('../utils/Errors')

const controller = {}

controller.getCategories = async (req, res, next) => {
  try {
    res.success({
      data: await categoryModule.get_all()
    })
  } catch (e) {
    next(e)
  }
}

controller.getCategoryDetails = async (req, res, next) => {
  let {category_id} = req.params
  try {
    res.success({
      data: await cateModule.get_details({category_id})
    })
  } catch (e) {
    next(e)
  }
}

controller.addCategory = async (req, res, next) => {
  let {category_title, category_icon} = req.body
  let isUploadFile =
    req.files &&
    req.files.length > 0 &&
    req.files[0].fieldname === 'category_icon'
  try {
    if (!helper.isValidObject(category_title))
      throw new BadRequest(messages.category.title_required)
    if (!helper.isValidObject(category_icon) && !isUploadFile)
      throw new BadRequest(messages.category.icon_required)
    if (isUploadFile) {
      if (!req.files[0]['mimetype'].includes('image'))
        throw new BadRequest(messages.common.image_invalid)
    }

    let category = await cateModule.add({category_title, category_icon})

    if (helper.isValidObject(category)) {
      if (isUploadFile) {
        category_icon = await fileModule.upload_single(
          req.files[0],
          'category/',
          category.category_id
        )
        category = await cateModule.update({
          category_id: category.category_id,
          category_title: null,
          category_icon
        })
      }

      res.success({
        message: messages.common.add_success,
        data: category
      })
    } else throw new GeneralError(messages.common.something_wrong)
  } catch (e) {
    next(e)
  }
}

controller.updateCategory = async (req, res, next) => {
  let {category_title, category_icon} = req.body
  let {category_id} = req.params
  let isUploadFile =
    req.files &&
    req.files.length > 0 &&
    req.files[0].fieldname === 'category_icon'
  try {
    if (isUploadFile) {
      if (!req.files[0]['mimetype'].includes('image'))
        throw new BadRequest(messages.common.image_invalid)
      category_icon = await fileModule.upload_single(
        req.files[0],
        'category/',
        category_id
      )
    }

    let category = await cateModule.update({
      category_id,
      category_title,
      category_icon
    })

    if (!helper.isValidObject(category))
      throw new NotFound(messages.category.not_found)

    res.success({
      message: messages.common.update_success,
      data: category
    })
  } catch (e) {
    next(e)
  }
}

controller.addDetails = async (req, res, next) => {
  let {category_id} = req.params
  let {details_id, required} = req.body
  try {
    if (!helper.isValidObject(details_id))
      throw new BadRequest(messages.category.details_id_required)

    if (await cateModule.add_details({category_id, details_id, required}))
      res.success({
        message: messages.common.add_success,
        data: [{added: true}]
      })
  } catch (e) {
    next(e)
  }
}

module.exports = controller
