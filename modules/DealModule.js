const conn = require('../connection')
const {v4: uuidv4} = require('uuid')
const {helper, utils} = require('../common')

const dealModule = {}

dealModule.getSellingDeals = ({seller_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select d.*, r.rate_numb from "Rate" as r right join (select p.post_id, p.seller_id, p.title, p.picture, d.time_created,
      d.deal_id, d.buyer_id, d.deal_state, d.receive_address, d.deal_price, d.online_deal
      from "Deal" d join "Post" p on d.post_id=p.post_id where p.seller_id=$1) as d on r.deal_id=d.deal_id`
    let params = [seller_id]
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

dealModule.getBuyingDeals = ({buyer_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select d.*, r.rate_numb from "Rate" as r right join (select p.post_id, p.seller_id, p.title, p.picture, d.time_created,
      d.deal_id, d.buyer_id, d.deal_state, d.receive_address, d.deal_price, d.online_deal
      from "Deal" d join "Post" p on d.post_id=p.post_id where d.buyer_id=$1) as d on r.deal_id=d.deal_id`
    let params = [buyer_id]
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows)
    })
  })
}

dealModule.getDeal = ({deal_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select p.post_id, p.seller_id, p.title, p.picture, d.time_created, 
      d.deal_id, d.buyer_id, d.deal_state, d.receive_address, d.deal_price, d.online_deal 
      from "Deal" d join "Post" p on d.post_id=p.post_id where d.deal_id=$1`
    let params = [deal_id]
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

dealModule.createDeal = ({
  buyer_id,
  post_id,
  receive_address,
  deal_price,
  online_deal
}) => {
  return new Promise((resolve, reject) => {
    let deal_id = uuidv4()
    let query = `insert into "Deal" (deal_id, buyer_id, post_id, receive_address, 
        deal_price, online_deal) values ($1, $2 , $3, $4, $5, $6) returning *`
    let params = [
      deal_id,
      buyer_id,
      post_id,
      receive_address,
      deal_price,
      online_deal
    ]

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

dealModule.update = ({deal_id, deal_state}) => {
  return new Promise((resolve, reject) => {
    let num = 1
    let query = `update "Deal" set `
    let params = []

    if (deal_state) {
      query += ` deal_state=$${num++},`
      params.push(deal_state)
    }

    if (query.endsWith(' ')) {
      query = `select * from "Deal" where deal_id=$${num}`
      params.push(deal_id)
    } else {
      query = utils.removeCharAt(query, query.length - 1)
      query += ` where deal_id=$${num} returning *`
      params.push(deal_id)
    }

    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

dealModule.rateDeal = ({deal_id, rate_numb, rate_content}) => {
  return new Promise((resolve, reject) => {
    let query = `insert into "Rate" (deal_id, rate_numb, rate_content) 
      values ($1, $2, $3) returning *`
    let params = [deal_id, rate_numb, rate_content]
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

dealModule.getRate = ({deal_id}) => {
  return new Promise((resolve, reject) => {
    let query = `select * from "Rate" where deal_id=$1`
    let params = [deal_id]
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

dealModule.getSeller = ({deal_id}) => {
  return new Promise((resolve, reject) => {
    //coalesce: replace value with another if null
    let query = `select u.user_id, u.name, u.avatar, u.phone, u.email, u.address, u.rating, 
    coalesce((select sum(rate_numb) from "Rate" where deal_id=$1 group by rate_numb) , 0) as rate_count
    from "Customer" u  where user_id in
    (select seller_id from "Post" where post_id in
    (select post_id from "Deal" where deal_id=$1 limit 1) limit 1)`
    let params = [deal_id]
    conn.query(query, params, (err, res) => {
      if (err) return reject(err)
      else return resolve(res.rows[0])
    })
  })
}

module.exports = dealModule
