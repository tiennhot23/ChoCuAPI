const conn = require('../connection')
const {v4: uuidv4} = require('uuid')
const {helper, utils} = require('../common')

const postModule = {}

/**
 *
 * @param {*} {key_search, location, category {category_id, details: [{details_id, content}]}}
 * @returns post_id, title, default_price, sell_address, picture, time_updated, priority_level
 */
postModule.get = ({key_search, location, category}) => {
  let arr_details = category?.details.map((e) => e?.details_id + e?.content)
  return new Promise((resolve, reject) => {
    let num = 1
    let query = `select post_id, title, default_price, sell_address, picture, time_updated, priority_level
      from "Post" p where post_state = 'active' ${
        category?.category_id
          ? ` and post_id in
                  (select post_id from "PostCateDetails"
                      where category_id ilike $${num++}
                      ${
                        arr_details && arr_details.length > 0
                          ? `and concat(detail_id, content) = any ($${num++})`
                          : ``
                      }) `
          : ``
      } ${location ? ` and sell_address ilike $${num++} ` : ``} ${
      key_search ? ` and keyword @@ to_tsquery($${num++}) ` : ``
    } order by priority_level desc, time_updated desc`

    let params = []
    if (category?.category_id) params.push(category.category_id)
    if (arr_details && arr_details.length > 0) params.push(arr_details)
    if (location) params.push(location)
    if (key_search) params.push(utils.toTSQueryPostgreSyntax(key_search))

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

module.exports = postModule
