const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.use('/', (req, res, next) => {
  res.json({message: 'HELLO STRANGER'})
})

app.listen(port, () => console.log(`Listening on port ${port}`))
