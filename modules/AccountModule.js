const conn = require('../connection')
const {v4: uuidv4} = require('uuid')
const bcrypt = require('bcrypt')
const {helper, utils} = require('../common')
const {isEmptyArray} = require('../common/helper')

const accountModule = {}

accountModule.findAccountByUsername = ({username}) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Account" where username=$1 and active=true`

    let params = [username]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

accountModule.findAccountByAccountID = ({account_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Account" where account_id=$1 and active=true`

    let params = [account_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

accountModule.lockAccount = ({account_id}) => {
  return new Promise((resolve, reject) => {
    let query = `update "Account" set active=false, access_tokens='{}', fcm_tokens='{}' where account_id=$1 returning *`

    let params = [account_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

module.exports = accountModule
