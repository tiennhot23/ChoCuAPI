const express = require('express')
const cors = require('cors')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

function postTrimmer(req, res, next) {
  for (const [key, value] of Object.entries(req.body)) {
    if (typeof value === 'string') req.body[key] = value.trim()
  }
  next()
}

app.use(postTrimmer)

const conn = require('./connection')

app.use('/', (req, res, next) => {
  conn.query(`select * from "Province"`, null, (err, result) => {
    if (err) res.json({err: err.message})
    else res.json({result})
  })
  //   res.json({message: 'HELLO STRANGER'})
})

app.listen(port, () => console.log(`Listening on port ${port}`))
