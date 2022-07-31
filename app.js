const express = require('express')
const cors = require('cors')

require('dotenv').config()

const upload = require('./routers/upload')
const location = require('./routers/location')
const otp = require('./routers/otp')
const user = require('./routers/user')
const errorHandling = require('./middlewares/errorHandling')
const responseHandling = require('./middlewares/responseHandling')
const post = require('./routers/post')
const category = require('./routers/category')
const details = require('./routers/details')
const admin = require('./routers/admin')

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

app.use(responseHandling)

app.use('/location', location)
app.use('/otp', otp)
app.use('/user', user)
app.use('/post', post)
app.use('/category', category)
app.use('/details', details)
app.use('/upload', upload)
app.use('/admin', admin)
app.use('/', (req, res, next) => {
  res.json({message: 'HELLO STRANGER'})
})

app.use(errorHandling)

app.listen(port, () => console.log(`Listening on port ${port}`))
