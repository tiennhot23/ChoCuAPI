const {helper, utils} = require('../common')
const conn = require('../connection')

const otp = {}

otp.getOTP = (phone) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "OTP" where phone = $1`

    var params = [phone]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

otp.createOTP = (phone) => {
  let otp_code = utils.getRandomInt(100000, 999999)
  let time_expired = utils.addMinutes(3)
  return new Promise((resolve, reject) => {
    let query = `insert into "OTP" (phone, otp_code, time_expired) 
        values ($1, $2, $3) returning *`

    var params = [phone, otp_code, time_expired]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

otp.updateOTP = (phone) => {
  let otp_code = utils.getRandomInt(100000, 999999)
  let time_expired = utils.addMinutes(3)
  return new Promise((resolve, reject) => {
    let query = `update "OTP" set (otp_code, time_expired) 
        values ($2, $3) where phone = $1 returning *`

    var params = [phone, otp_code, time_expired]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

otp.verifyOTP = (phone, otp_code) => {
  return new Promise((resolve, reject) => {
    let query = `select time_expired from "OTP" where phone = $1 and otp_code = $2`

    var params = [phone, otp_code]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else {
        if (res && res.rows.length > 0) {
          let {time_expired} = res.rows[0]

          console.log('VERIFY_OTP', {
            time_expired,
            current_time: new Date().toISOString(),
            isExpired: time_expired < new Date()
          })

          if (time_expired >= new Date()) {
            return resolve(true)
          } else return resolve(false)
        } else {
          return resolve(false)
        }
      }
    })
  })
}

otp.deleteOTP = (phone) => {
  return new Promise((resolve, reject) => {
    let query = `delete from "OTP" where phone = $1`

    var params = [phone]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(true)
    })
  })
}

module.exports = otp
