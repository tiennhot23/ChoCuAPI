const express = require('express')
const cors = require('cors')

const upload = require('./routers/upload')

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

app.use('/upload', upload)
app.use('/', (req, res, next) => {
  res.json({message: 'HELLO STRANGER'})
})

app.listen(port, () => console.log(`Listening on port ${port}`))
