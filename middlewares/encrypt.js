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

module.exports = encrypt
