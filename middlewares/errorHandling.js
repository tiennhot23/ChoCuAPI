const {messages} = require('../common')
const {GeneralError} = require('../utils/Errors')

const errorHandling = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.code).json({
      status: 'error',
      code: err.code,
      message: err.message,
      data: []
    })
  }

  if (err.constraint) {
    switch (err.constraint) {
      case 'username_unique': {
        return res.json({
          status: 'error',
          code: 400,
          message: messages.constraint.username_unique,
          data: []
        })
      }
      default: {
        return res.status(500).json({
          status: 'error',
          code: 500,
          message: err.message,
          data: []
        })
      }
    }
  } else {
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: err.message,
      data: []
    })
  }
}

module.exports = errorHandling
