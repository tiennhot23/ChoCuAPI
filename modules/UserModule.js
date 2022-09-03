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
    let query = `select u.user_id, name, avatar, phone, email, address, rating, post_turn, a.role_id, a.active, a.fcm_tokens 
    from "Customer" u, "Account" a where u.account_id=a.account_id and user_id=$1`

    let params = [user_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

userModule.getUserFollows = ({user_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select user_following_id=$1 as is_following, count(*) from "Follower" 
    where user_follower_id=$1 or user_following_id=$1 group by user_following_id=$1`

    let params = [user_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else {
        let user_follower = 0
        let user_following = 0
        res.rows.map((item) => {
          if (item.is_following) {
            user_following = Number(item.count)
          } else {
            user_follower = Number(item.count)
          }
        })
        return resolve({user_follower, user_following})
      }
    })
  })
}

userModule.getUserFollowing = ({user_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select user_follower_id from "Follower" where user_following_id=$1`

    let params = [user_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else {
        return resolve(res.rows)
      }
    })
  })
}

userModule.getUserFollower = ({user_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select user_following_id from "Follower" where user_follower_id=$1`

    let params = [user_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else {
        return resolve(res.rows)
      }
    })
  })
}

userModule.getUserPosts = ({user_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select post_id, title, default_price, sell_address, picture, time_created,  time_updated, post_state 
    from "Post" where seller_id=$1 and (post_state='active' or post_state='sold') order by time_created`

    let params = [user_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

userModule.getUserPayments = ({user_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select u.user_id, p.payment_id, u.user_payment_info, p.title 
    from "UserPayment" u join "OnlinePayment" p on u.payment_id=p.payment_id 
    where user_id=$1`

    let params = [user_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

userModule.getUserPostTurn = ({user_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select post_turn from "Customer" where user_id=$1 limit 1`
    let params = [user_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

userModule.findUserByAccount = ({account_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select u.user_id, name, phone, email, address, rating, a.role_id, a.active, post_turn, a.fcm_tokens 
    from "Customer" u, "Account" a where u.account_id=a.account_id and a.account_id=$1`

    let params = [account_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

userModule.findAccountByUsername = ({username}) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Account" where username=$1`

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
    let query = `select 1 as exist from "Account" where account_id=$1 and  $2 = ANY (access_tokens::varchar[])`

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
    let query = `select * from "Account" a where a.username=$1`
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
    let num = 1
    let params = []

    let query = `update "Account" set `
    if (access_token) {
      query += ` access_tokens=array_append(access_tokens, $${num++}),`
      params.push(access_token)
    }
    if (fcm_token) {
      query += ` fcm_tokens=array_append(fcm_tokens, $${num++}),`
      params.push(fcm_token)
    }

    if (query.endsWith(' ')) {
      return resolve(false)
    } else {
      query = utils.removeCharAt(query, query.length - 1)
    }

    query += ` where account_id=$${num++} returning account_id`
    params.push(account_id)

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(true)
    })
  })
}

userModule.removeAccountToken = ({account_id, access_token, fcm_token}) => {
  return new Promise((resolve, reject) => {
    let num = 1
    let params = []

    let query = `update "Account" set `
    if (access_token) {
      query += ` access_tokens=array_remove(access_tokens, $${num++}),`
      params.push(access_token)
    }
    if (fcm_token) {
      query += ` fcm_tokens=array_remove(fcm_tokens, $${num++}),`
      params.push(fcm_token)
    }

    if (query.endsWith(' ')) {
      return resolve(false)
    } else {
      query = utils.removeCharAt(query, query.length - 1)
    }

    query += ` where account_id=$${num++} returning account_id`
    params.push(account_id)

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(true)
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

    query += ` where user_id=$${num} returning user_id, name, avatar, phone, email, address, post_turn `
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
    let query = `update "Account" set password=$2 where account_id=$1`
    let params = [account_id, password]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(true)
    })
  })
}

userModule.updateRating = ({user_id, rating}) => {
  return new Promise((resolve, reject) => {
    let query = `update "Customer" set rating=$2 where user_id=$1`
    let params = [user_id, rating]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(true)
    })
  })
}

userModule.addUserPayment = ({user_id, payment_id, user_payment_info}) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "UserPayment" values ($1, $2, $3)`
    let params = [user_id, payment_id, user_payment_info]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(true)
    })
  })
}

userModule.removeUserPayment = ({user_id, payment_id}) => {
  return new Promise((resolve, reject) => {
    let query = `delete from "UserPayment" where user_id=$1 and payment_id=$2 returning *`
    let params = [user_id, payment_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(true)
    })
  })
}

userModule.decreasePostTurn = ({user_id}) => {
  return new Promise((resolve, reject) => {
    let query = `update "Customer" set post_turn=post_turn-1 where user_id=$1 returning post_turn`
    let params = [user_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

userModule.increasePostTurn = ({user_id, extra_post_turn}) => {
  return new Promise((resolve, reject) => {
    let query = `update "Customer" set post_turn=post_turn+$2 where user_id=$1 returning post_turn`
    let params = [user_id, extra_post_turn]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

userModule.getUserRevenueStat = ({
  user_id,
  fromDate = '1990-01-01',
  toDate = `${
    new Date().getFullYear() +
    '-' +
    ('0' + (new Date().getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + new Date().getDate()).slice(-2)
  }`
}) => {
  return new Promise((resolve, reject) => {
    let query = `select d.time_created::date, sum(p.default_price) as price_sum from "Deal" d left join "Post" p on d.post_id = p.post_id
    where p.seller_id = $1 and d.time_created >= $2 and d.time_created <= $3
    group by d.time_created::date order by time_created desc`
    let params = [user_id, fromDate, toDate]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

module.exports = userModule
