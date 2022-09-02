const conn = require('../connection')
const {v4: uuidv4} = require('uuid')
const {helper, utils} = require('../common')

const postModule = {}

/**
 *
 * @param {*} {key_search, location, category {category_id, details: [{details_id, content}]}}
 * @returns post_id, title, default_price, sell_address, picture, time_updated
 */
postModule.get = ({key_search, location, category}) => {
  let arr_details = category?.details.filter((e) => e?.content !== '')
  console.log(arr_details)
  return new Promise((resolve, reject) => {
    let num = 1
    let query = `select post_id, title, default_price, sell_address, picture, time_created, time_updated, online_payment 
      from "Post" p where post_state = 'active' ${
        category?.category_id
          ? ` and category_id=${category?.category_id} `
          : ``
      } ${
      arr_details && arr_details.length > 0
        ? ` and post_id in
                  (select post_id from "PostCateDetails"
                      where category_id = $${num++}
                      ${
                        arr_details && arr_details.length > 0
                          ? `and concat(details_id, content) = any (ARRAY [ ${arr_details.map(
                              (e) => `'${e?.details_id}${e?.content}'`
                              // e?.content === ''
                              //   ? '' // `concat(${e.details_id}, content)`
                              //   : `'${e?.details_id}${e?.content}'`
                            )} ])`
                          : ``
                      }) `
        : ``
    } ${location ? ` and sell_address ilike $${num++} ` : ``} ${
      key_search ? ` and keyword @@ to_tsquery($${num++}) ` : ``
    } order by time_created desc`

    let params = []
    if (arr_details && arr_details.length > 0) params.push(category.category_id)
    // if (arr_details && arr_details.length > 0) params.push(arr_details)
    if (location) params.push('%' + location)
    if (key_search) params.push(utils.toTSQueryPostgreSyntax(key_search))

    console.log(query)
    console.log(params)
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

postModule.getUserPosts = ({user_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Post" where seller_id=$1`
    let params = [user_id]
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

postModule.getPost = ({post_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select post_id, seller_id, title, default_price, sell_address, post_state, 
      description, picture, time_created, time_updated, online_payment, category_id  
      from "Post" where post_id=$1`
    let params = [post_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

postModule.getAllRating = ({post_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select u.user_id, u.name, u.avatar, u.phone, r.* from "Rate" r, (
      select c.*, d.deal_id from "Customer" c join "Deal" d on c.user_id = d.buyer_id
      where post_id=$1 and deal_state='done') u where r.deal_id = u.deal_id`
    let params = [post_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

postModule.getPostCate = ({category_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Category" 
      where category_id=$1 limit 1`
    let params = [category_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

postModule.getPostCateDetails = ({post_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select pcd.details_id, details_title, details_icon, content 
      from "PostCateDetails" pcd, "Details" d 
      where d.details_id=pcd.details_id and pcd.post_id=$1`
    let params = [post_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

postModule.add = ({
  seller_id,
  title,
  default_price,
  sell_address,
  description,
  picture,
  category_id,
  online_payment
}) => {
  return new Promise((resolve, reject) => {
    let num = 8
    let post_id = uuidv4()
    let query = `insert into "Post" (post_id, seller_id, title, default_price, sell_address, picture, category_id 
    ${description ? `, description` : ``} ${
      online_payment ? `, online_payment` : ``
    }) values ($1, $2, $3, $4, $5, $6, $7 
    ${description ? `, $${num++}` : ``} ${
      online_payment ? `, $${num++}` : ``
    }) returning *`

    let params = [
      post_id,
      seller_id,
      title,
      default_price,
      sell_address,
      picture,
      category_id
    ]
    if (description) params.push(description)
    if (online_payment) params.push(online_payment)

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

postModule.addPostCateDetails = ({post_id, category_id, details}) => {
  return new Promise((resolve, reject) => {
    if (details.length === 0) return resolve(null)
    let query = `insert into "PostCateDetails" (post_id, category_id, details_id, content) values `
    let num = 3
    let params = [post_id, category_id]
    details.map((e) => {
      query += `($1, $2, $${num++}, $${num++}),`
      params.push(e.details_id, e.content)
    })

    if (query.endsWith('values ')) return resolve(null)
    query = utils.removeCharAt(query, query.length - 1)
    query += ` returning *`

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else resolve(res.rows)
    })
  })
}

postModule.removePostCateDetails = ({post_id}) => {
  return new Promise((resolve, reject) => {
    let query = `delete from "PostCateDetails" where post_id=$1 returning *`
    let params = [post_id]
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else resolve(res.rows)
    })
  })
}

postModule.update = ({
  post_id,
  title,
  default_price,
  sell_address,
  description,
  online_payment,
  category_id,
  picture,
  post_state
}) => {
  return new Promise((resolve, reject) => {
    let num = 1
    let query = `update "Post" set `
    let params = []

    if (title) {
      query += ` title=$${num++},`
      params.push(title)
    }
    if (default_price) {
      query += ` default_price=$${num++},`
      params.push(default_price)
    }
    if (sell_address) {
      query += ` sell_address=$${num++},`
      params.push(sell_address)
    }
    if (description) {
      query += ` description=$${num++},`
      params.push(description)
    }
    if (online_payment) {
      query += ` online_payment=$${num++},`
      params.push(online_payment)
    }
    if (picture) {
      query += ` picture=$${num++},`
      params.push(picture)
    }
    if (category_id) {
      query += ` category_id=$${num++},`
      params.push(category_id)
    }
    if (post_state) {
      query += ` post_state=$${num++},`
      params.push(post_state)
    }
    if (query.endsWith(' ')) {
      query = `select * from "Post" where post_id=$${num}`
      params.push(post_id)
    } else {
      query = utils.removeCharAt(query, query.length - 1)
      query += ` where post_id=$${num} returning *`
      params.push(post_id)
    }

    console.log(query)
    console.log(params)

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

postModule.delete = ({post_id}) => {
  return new Promise((resolve, reject) => {
    let query = `delete from "Post" where post_id=$1 and post_state='pending' returning *`
    let params = [post_id]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

module.exports = postModule
