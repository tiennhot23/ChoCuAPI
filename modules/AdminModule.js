const conn = require('../connection')
const {v4: uuidv4} = require('uuid')
const bcrypt = require('bcrypt')
const {helper, utils} = require('../common')
const {isEmptyArray} = require('../common/helper')

const adminModule = {}

adminModule.getAllPost = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Post"`

    let params = []

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

adminModule.closeAllUserPost = ({user_id}) => {
  return new Promise((resolve, reject) => {
    let query = `update "Post" set post_state='expired' where seller_id=$1 returning *`

    let params = [user_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

adminModule.getPendingPost = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Post" where post_state='pending'`

    let params = []

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

adminModule.getAllUser = () => {
  return new Promise((resolve, reject) => {
    let query = `select c.*, a.active, a.role_id from "Customer" c join "Account" a on c.account_id=a.account_id`

    let params = []

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

adminModule.findAdminByAccount = ({account_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select user_id, name, email, a.role_id, a.active
      from "Director" u, "Account" a where u.account_id=a.account_id and a.account_id=$1`

    let params = [account_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

module.exports = adminModule
