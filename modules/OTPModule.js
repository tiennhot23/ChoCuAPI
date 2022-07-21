const {helper, utils} = require('../common')
const conn = require('../connection')

const otp = {}

/**
 *
 * @param {*} phone
 * @returns object otp
 */
otp.getOTP = (phone) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "OTP" where phone = $1 limit 1`

    var params = [phone]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

/**
 *
 * @param {*} phone
 * @returns otp_code, time_expired
 */
otp.createOTP = (phone) => {
  let otp_code = utils.getRandomInt(100000, 999999)
  let verify_code = utils.getRandomInt(100000, 999999)
  let time_expired = utils.addMinutes(3)
  return new Promise((resolve, reject) => {
    let query = `insert into "OTP" (phone, otp_code, time_expired, verified, verify_code) values ($1, $2, $3, $4, $5) returning otp_code, time_expired`

    var params = [phone, otp_code, time_expired, false, verify_code]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

/**
 *
 * @param {*} phone
 * @returns otp_code, time_expired
 */
otp.resetOTP = (phone) => {
  let otp_code = utils.getRandomInt(100000, 999999)
  let verify_code = utils.getRandomInt(100000, 999999)
  let time_expired = utils.addMinutes(3)
  return new Promise((resolve, reject) => {
    let query = `update "OTP" set otp_code=$2, time_expired=$3, verified=$4, verify_code=$5 where phone = $1 returning otp_code, time_expired`

    var params = [phone, otp_code, time_expired, false, verify_code]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

/**
 *
 * @param {*} phone
 * @returns verify_code
 */
otp.verifyOTP = (phone) => {
  return new Promise((resolve, reject) => {
    let query = `update "OTP" set verified=true where phone = $1 returning verify_code`
    conn.query(query, [phone], (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

/**
 *
 * @param {*} phone
 * @returns true or false
 */
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
