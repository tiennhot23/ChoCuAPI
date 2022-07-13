const conn = require('../connection')

const location = {}

location.get_all_provinces = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Province"`

    conn.query(query, null, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

location.get_all_districts = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "District"`

    conn.query(query, null, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

module.exports = location
