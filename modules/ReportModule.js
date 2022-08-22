const {helper, utils} = require('../common')
const conn = require('../connection')

const report = {}

report.createReport = ({post_id, contact_info, content}) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "Report"(post_id, contact_info, content) values($1,$2,$3) returning *`

    var params = [post_id, contact_info, content]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

module.exports = report
