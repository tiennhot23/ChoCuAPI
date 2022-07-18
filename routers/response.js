const {messages} = require('../common')

module.exports = response = (data, req, res, next) => {
  if (data instanceof Error) {
    if (data.constraint) {
      switch (data.constraint) {
        case 'username_unique': {
          res.json({
            status: 'fail',
            code: 400,
            message: messages.constraint.username_unique,
            data: []
          })
          break
        }
        default: {
          res.json({
            status: 'fail',
            code: data.code,
            message: data.message || '',
            data: []
          })
          break
        }
      }
    } else {
      res.json({
        status: 'fail',
        code: data.code,
        message: data.message || '',
        data: []
      })
    }
  } else {
    data.status = 'success'
    data.code = 200
    data.message = data.message || ''
    if (data.page) {
      res.json({
        ...data,
        page: Number(page)
      })
    } else {
      res.json(data)
    }
  }
}
