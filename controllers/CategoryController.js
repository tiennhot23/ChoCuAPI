const {categoryController} = require('.')
const {helper, utils, messages} = require('../common')
const {role} = require('../common/constants')
const {categoryModule} = require('../modules')
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
  try {
    if (!helper.isValidObject(category_title))
      throw new BadRequest(messages.category.title_required)
    if (!helper.isValidObject(category_icon))
      throw new BadRequest(messages.category.icon_required)

    res.success({
      message: messages.common.add_success,
      data: await cateModule.add({category_title, category_icon})
    })
  } catch (e) {
    next(e)
  }
}

controller.updateCategory = async (req, res, next) => {
  let {category_title, category_icon} = req.body
  let {category_id} = req.params
  try {
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
