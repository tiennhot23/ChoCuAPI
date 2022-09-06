const {Pool} = require('pg')

const conn = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

conn.on('error', (err) => {
  debug('Connect db error: ${err}')
  process.exit(-1)
})

module.exports = conn
