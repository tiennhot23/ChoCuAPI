const {helper, utils, messages} = require('../common')
const {role} = require('../common/constants')
const {postModule} = require('../modules')
const {
  BadRequest,
  GeneralError,
  Forbidden,
  NotFound
} = require('../utils/Errors')

const controller = {}

controller.getPosts = async (req, res, next) => {
  let {page, location, key_search, category} = req.body
  if (key_search) key_search = helper.removeAccent(key_search).toLowerCase()
  try {
    res.success({
      data: await postModule.get({key_search, location, category})
    })
  } catch (e) {
    next(e)
  }
}

module.exports = controller
