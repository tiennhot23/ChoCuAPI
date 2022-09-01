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
      case 'cate_fk': {
        return res.json({
          status: 'error',
          code: 500,
          message: messages.constraint.cate_fk,
          data: []
        })
      }
      case 'details_fk': {
        return res.json({
          status: 'error',
          code: 500,
          message: messages.constraint.details_fk,
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
