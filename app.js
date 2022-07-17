const express = require('express')
const cors = require('cors')

require('dotenv').config()

const upload = require('./routers/upload')
const location = require('./routers/location')
const otpRouter = require('./routers/otp')

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

const onGetResult = (data, req, res, next) => {
  if (data instanceof Error) {
    res.json({
      status: 'fail',
      code: data.code,
      message: data.message || '',
      data: []
    })
  } else {
    data.status = 'success'
    data.code = 200
    data.message = data.message || ''
    if (data.page) {
      res.json({
        ...data,
        page: Number(page)
      })
    } else {
      res.json(data)
    }
  }
}

app.use('/location', location, onGetResult)
app.use('/otp', otpRouter, onGetResult)
app.use('/upload', upload)
app.use('/', (req, res, next) => {
  res.json({message: 'HELLO STRANGER'})
})

app.listen(port, () => console.log(`Listening on port ${port}`))
