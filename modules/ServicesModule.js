const {helper, utils} = require('../common')
const {limit_element} = require('../common/constants')
const conn = require('../connection')

const services = {}

services.getPostTurnServices = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "PostTurnServices"`
    let params = []
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

services.addUserServices = ({service_id, user_id, price}) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "CustomerService" (service_id, user_id, price) values ($1, $2, $3) returning *`
    let params = [service_id, user_id, price]
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

services.getUserBuyServices = ({month, year}) => {
  return new Promise((resolve, reject) => {
    let query = `select time_buy::date, sum(price) as price from "CustomerService" 
    where date_part('month', time_buy) = $1 and date_part('year', time_buy) = $2 
    group by time_buy::date order by time_buy`
    let params = [
      month ? month : new Date().getMonth() + 1,
      year ? year : new Date().getFullYear()
    ]
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

module.exports = services
