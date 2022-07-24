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
    let query = `select * from "Category" where category_title=$1 limit 1`
    let params = [category_title]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

cateModule.add = ({category_title, category_icon}) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "Category" (category_title, category_icon) values ($1, $2) returning *`
    let params = [category_title, category_icon]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
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

module.exports = cateModule
