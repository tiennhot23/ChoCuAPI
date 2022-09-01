const {helper, utils} = require('../common')
const conn = require('../connection')

const report = {}

report.getAll = () => {
  return new Promise((resolve, reject) => {
    let query = `select r.*, title, default_price, sell_address, post_state, picture
    from "Report" r join "Post" p on r.post_id=p.post_id order by post_id, r.time_created desc`
    let params = []
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

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

report.removePostReports = ({post_id}) => {
  return new Promise((resolve, reject) => {
    let query = `delete from "Report" where post_id=$1 returning *`

    var params = [post_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

module.exports = report
