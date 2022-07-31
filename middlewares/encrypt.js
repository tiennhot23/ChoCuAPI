const bcrypt = require('bcrypt')

const {constants, messages, helper} = require('../common')
const {BadRequest} = require('../utils/Errors')

const encrypt = {}

encrypt.hashPassword = (req, res, next) => {
  var password = req.body.password

  try {
    if (!password || password.trim().length == 0)
      throw new BadRequest(messages.encrypt.password_required)
    if (!helper.isValidPassword(password))
      throw new BadRequest(messages.user.password_invalid)
    req.body.password = bcrypt.hashSync(password, constants.saltRounds)
  } catch (e) {
    next(e)
  }

  next()
}

encrypt.createAdminPassword = (req, res, next) => {
  let admin_id = req.body.account_id
  try {
    if (!admin_id || helper.isEmptyString(admin_id))
      throw new BadRequest(messages.encrypt.admin_id_required)
    req.body.password = bcrypt.hashSync(admin_id, constants.saltRounds)
  } catch (e) {
    next(e)
  }
}

module.exports = encrypt
