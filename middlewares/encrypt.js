const bcrypt = require('bcrypt')

const {constants, messages} = require('../common')

const encrypt = {}

encrypt.hashPassword = (req, res, next) => {
  var pwd = req.body.password
  if (!pwd || pwd.trim().length == 0) {
    return res.status(400).json({
      status: 'fail',
      code: 400,
      message: messages.encypt.password_required,
      data: null
    })
  }
  try {
    req.body.password = bcrypt.hashSync(pwd, constants.saltRounds)
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      code: 500,
      message: err.message,
      data: null
    })
  }

  next()
}

module.exports = encrypt
