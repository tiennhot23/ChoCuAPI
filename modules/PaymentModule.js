const {helper, utils} = require('../common')
const {limit_element} = require('../common/constants')
const conn = require('../connection')

const payment = {}

payment.getPayments = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "OnlinePayment"`
    let params = []
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

module.exports = payment
