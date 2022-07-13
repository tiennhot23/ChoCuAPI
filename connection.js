const {Pool} = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

pool.on('error', (err) => {
  debug('Connect db error: ${err}')
  process.exit(-1)
})

module.exports = pool
