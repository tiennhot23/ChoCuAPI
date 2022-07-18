const conn = require('../connection')
const {v4: uuidv4} = require('uuid')

const userModule = {}

userModule.createAccount = ({phone, password}) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "Account" (username, password, role_id) values ($1, $2, $3) returning account_id`

    let params = [phone, password, 'customer']

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows.length > 0 ? res.rows[0] : {})
    })
  })
}

userModule.createUser = ({account_id, phone}) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "Customer" (user_id, account_id, phone) values ($1, $2, $3)`
    let user_id = uuidv4()
    let params = [user_id, account_id, phone]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(true)
    })
  })
}

module.exports = userModule
