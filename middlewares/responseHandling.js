const {helper} = require('../common')

function responseHandling(req, res, next) {
  res.success = ({
    status = 'success',
    code = 200,
    message = '',
    page,
    data = []
  }) => {
    return res.json({
      status,
      code,
      message,
      page,
      data: helper.isArray(data) ? data : [data]
    })
  }

  next()
}

module.exports = responseHandling
