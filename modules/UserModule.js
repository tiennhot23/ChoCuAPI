const conn = require('../connection')
const {v4: uuidv4} = require('uuid')
const bcrypt = require('bcrypt')
const {helper, utils} = require('../common')
const {isEmptyArray} = require('../common/helper')

const userModule = {}

/**
 *
 * @param {*} user_id
 * @returns u.user_id, name, phone, email, address, rating, a.role_id
 */
userModule.getUserInfo = ({user_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select u.user_id, name, phone, email, address, rating, a.role_id
    from "Customer" u, "Account" a where user_id=$1`

    let params = [user_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

userModule.findUserByAccount = ({account_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select u.user_id, name, phone, email, address, rating, a.role_id
    from "Customer" u, "Account" a where a.account_id=$1`

    let params = [account_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

userModule.findAdminByAccount = ({account_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select u.admin_id as user_id, name, email, a.role_id
    from "Admin" u, "Account" a where a.account_id=$1`

    let params = [account_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

userModule.findAccountByUsername = ({username}) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Account" where username=$1 and active=true`

    let params = [username]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

/**
 *
 * @param {*} {account_id, access_token}
 * @returns exist 1 ot not
 */
userModule.isValidAccessToken = ({account_id, access_token}) => {
  return new Promise((resolve, reject) => {
    let query = `select 1 as exist from "Account" where account_id=$1 and active=true and  $2 = ANY (access_tokens::varchar[])`

    let params = [account_id, access_token]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

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
      else return resolve([])
    })
  })
}

userModule.login = ({username, password}) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Account" a where a.username=$1 and a.active=true`
    let params = [username]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else {
        if (
          isEmptyArray(res.rows) ||
          !bcrypt.compareSync(password, res.rows[0].password)
        ) {
          return resolve(null)
        } else {
          return resolve(res.rows[0])
        }
      }
    })
  })
}

userModule.addAccountToken = ({account_id, access_token, fcm_token}) => {
  return new Promise((resolve, reject) => {
    let query = `update "Account" set access_tokens=array_append(access_tokens, $2), fcm_tokens=array_append(fcm_tokens, $3) where account_id=$1 returning account_id`
    let params = [account_id, access_token, fcm_token]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

userModule.removeAccountToken = ({account_id, access_token, fcm_token}) => {
  return new Promise((resolve, reject) => {
    let query = `update "Account" set access_tokens=array_remove(access_tokens, $2), fcm_tokens=array_remove(fcm_tokens, $3) where account_id=$1 returning account_id`
    let params = [account_id, access_token, fcm_token]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

userModule.updateInfo = ({user_id, name, avatar, email, address}) => {
  return new Promise((resolve, reject) => {
    let num = 1
    let params = []

    let query = `update "Customer" set `
    if (name) {
      query += ` name=$${num++},`
      params.push(name)
    }
    if (avatar) {
      query += ` avatar=$${num++},`
      params.push(avatar)
    }
    if (email) {
      query += ` email=$${num++},`
      params.push(email)
    }
    if (address) {
      query += ` address=$${num++},`
      params.push(address)
    }

    if (query.endsWith(' ')) {
      return resolve(null)
    } else {
      query = utils.removeCharAt(query, query.length - 1)
    }

    query += ` where user_id=$${num} returning user_id, name, avatar, phone, email, address`
    params.push(user_id)

    conn.query(query, params, (err, res) => {
      if (err) {
        return reject(err)
      } else {
        return resolve(res.rows[0])
      }
    })
  })
}

userModule.updatePassword = ({account_id, password}) => {
  return new Promise((resolve, reject) => {
    let query = `update "Account" set password=$2 where account_id=$1 and active=true`
    let params = [account_id, password]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(true)
    })
  })
}

module.exports = userModule
