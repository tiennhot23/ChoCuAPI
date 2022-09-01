const conn = require('../connection')
const {v4: uuidv4} = require('uuid')
const {helper, utils} = require('../common')

const detailsModule = {}

detailsModule.get_all = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Details"`
    let params = []

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

detailsModule.get = ({details_title}) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Details" where details_title=$1 limit 1`
    let params = [details_title]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

detailsModule.add = ({
  details_title,
  details_icon,
  default_content,
  editable
}) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "Details" (details_title, details_icon ${
      default_content ? `, default_content` : ``
    } ${editable ? `, editable` : ``}) values ($1, $2 ${
      default_content ? `, $3` : ``
    } ${editable ? `, $4` : ``}) returning *`
    let params = [details_title, details_icon]
    if (default_content) params.push(default_content)
    if (editable) params.push(editable)

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

detailsModule.update = ({
  details_id,
  details_title,
  details_icon,
  default_content,
  editable
}) => {
  return new Promise((resolve, reject) => {
    let num = 1
    let query = `update "Details" set `
    let params = []

    if (details_title) {
      query += ` details_title=$${num++},`
      params.push(details_title)
    }
    if (details_icon) {
      query += ` details_icon=$${num++},`
      params.push(details_icon)
    }
    if (default_content) {
      query += ` default_content=$${num++},`
      params.push(default_content)
    }
    if (editable) {
      query += ` editable=$${num++},`
      params.push(editable)
    }

    if (query.endsWith(' ')) {
      query = `select * from "Details" where details_id=$${num}`
      params.push(details_id)
    } else {
      query = utils.removeCharAt(query, query.length - 1)
      query += ` where details_id=$${num} returning *`
      params.push(details_id)
    }

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

detailsModule.delete = ({details_id}) => {
  return new Promise((resolve, reject) => {
    let query = `delete from "Details" where details_id=$1 returning *`
    let params = [details_id]
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

module.exports = detailsModule
