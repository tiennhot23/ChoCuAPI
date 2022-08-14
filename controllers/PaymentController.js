const {paymentModule} = require('../modules')
const {helper, utils, messages} = require('../common')
const {BadRequest} = require('../utils/Errors')

const payment = {}

payment.getPayments = async (req, res, next) => {
  try {
    res.success({
      data: await paymentModule.getPayments()
    })
  } catch (e) {
    next(e)
  }
}

module.exports = payment
