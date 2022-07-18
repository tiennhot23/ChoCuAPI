const {helper, utils, messages} = require('../common')
const {Err, Response} = require('../models')
const userModule = require('../modules/UserModule')

const userController = {}

userController.createAccount = async (req, res, next) => {
  let {phone, password} = req.body
  try {
    if (!phone) return next(new Err(messages.user.phone_required, 400, null))
    if (!helper.isValidatePhone(phone))
      return next(new Err(messages.user.phone_invalid, 400, null))
    if (!password)
      return next(new Err(messages.user.missing_password, 400, null))
    if (!helper.isValidPassword(password))
      return next(new Err(messages.user.password_invalid, 400, null))

    let {account_id} = await userModule.createAccount({phone, password})
    if (account_id)
      next({data: await userModule.createUser({account_id, phone})})
    else next(new Err(messages.common.something_wrong), 500, null)
  } catch (e) {
    next(new Err(e.message, 500, e.constraint))
  }
}

module.exports = userController
