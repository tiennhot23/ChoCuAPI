const conn = require('../connection')

const location = {}

location.get_all = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Location"`

    conn.query(query, null, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

location.get_provinces = () => {
  return new Promise((resolve, reject) => {
    let query = `select distinct province from "Location"`

    conn.query(query, null, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

location.get_ditricts = (province) => {
  return new Promise((resolve, reject) => {
    let query = `select distinct district from "Location" where province = $1`

    conn.query(query, [province], (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

location.get_wards = (district) => {
  return new Promise((resolve, reject) => {
    let query = `select distinct ward from "Location" where district = $1`

    conn.query(query, [district], (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

module.exports = location
