const {helper, utils} = require('../common')
const {limit_element} = require('../common/constants')
const conn = require('../connection')

const services = {}

services.getPostTurnServices = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Service"`
    let params = []
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

services.addUserServices = ({user_id, price}) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "CustomerService" (user_id, price) values ($1, $2) returning *`
    let params = [user_id, price]
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

services.getUserBuyServices = ({month, year}) => {
  return new Promise((resolve, reject) => {
    let query = `select time_buy::date, sum(price) as price 
    from "CustomerService" c 
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

services.addPostTurnService = ({
  service_name,
  post_turn,
  description,
  price
}) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "Service" (service_name, post_turn, description, price) values ($1, $2, $3, $4) returning *`
    let params = [service_name, post_turn, description, price]
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

services.updatePostTurnService = ({
  service_id,
  service_name,
  post_turn,
  description,
  price
}) => {
  return new Promise((resolve, reject) => {
    let num = 1
    let params = []

    let query = `update "Service" set `
    if (service_name) {
      query += ` service_name=$${num++},`
      params.push(service_name)
    }
    if (post_turn) {
      query += ` post_turn=$${num++},`
      params.push(post_turn)
    }
    if (description) {
      query += ` description=$${num++},`
      params.push(description)
    }
    if (price) {
      query += ` price=$${num++},`
      params.push(price)
    }

    if (query.endsWith(' ')) {
      return resolve(false)
    } else {
      query = utils.removeCharAt(query, query.length - 1)
    }

    query += ` where service_id=$${num++} returning *`
    params.push(service_id)
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

services.removePostTurnService = ({service_id}) => {
  return new Promise((resolve, reject) => {
    let query = `delete from "Service" where service_id=$1 returning *`
    let params = [service_id]
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

module.exports = services
