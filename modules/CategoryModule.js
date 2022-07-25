const conn = require('../connection')
const {v4: uuidv4} = require('uuid')
const {helper, utils} = require('../common')

const cateModule = {}

cateModule.get_all = () => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Category"`
    let params = []

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

cateModule.get = ({category_title}) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Category" c, "Details" d where category_title=$1 limit 1`
    let params = [category_title]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

cateModule.get_details = ({category_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select d.*, required from (select details_id, required from "CateDetails" where category_id=$1) cd
    left join "Details" d on cd.details_id = d.details_id`
    let params = [category_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

cateModule.add = ({category_title, category_icon}) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "Category" (category_title, category_icon) values ($1, $2) returning *`
    let params = [category_title, category_icon]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

cateModule.update = ({category_id, category_title, category_icon}) => {
  return new Promise((resolve, reject) => {
    let num = 1
    let query = `update "Category" set `
    let params = []

    if (category_title) {
      query += ` category_title=$${num++},`
      params.push(category_title)
    }
    if (category_icon) {
      query += ` category_icon=$${num++},`
      params.push(category_icon)
    }

    if (query.endsWith(' ')) {
      query = `select * from "Category" where category_id=$${num}`
      params.push(category_id)
    } else {
      query = utils.removeCharAt(query, query.length - 1)
      query += ` where category_id=$${num} returning *`
      params.push(category_id)
    }

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

cateModule.add_details = ({category_id, details_id, required}) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "CateDetails" (category_id, details_id ${
      required ? `, required` : ``
    }) values ($1,$2 ${required ? `, $3` : ``}) returning *`
    let params = [category_id, details_id]
    if (required) params.push(required)

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(true)
    })
  })
}

module.exports = cateModule
