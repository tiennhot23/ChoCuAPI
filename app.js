const express = require('express')
const cors = require('cors')

require('dotenv').config()

const upload = require('./routers/upload')
const location = require('./routers/location')
const otp = require('./routers/otp')
const user = require('./routers/user')
const response = require('./routers/response')

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

app.use('/location', location, response)
app.use('/otp', otp, response)
app.use('/user', user, response)
app.use('/upload', upload)
app.use('/', (req, res, next) => {
  res.json({message: 'HELLO STRANGER'})
})

app.listen(port, () => console.log(`Listening on port ${port}`))
