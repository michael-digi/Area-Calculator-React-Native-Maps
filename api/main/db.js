const { Pool } = require('pg')

const pool = new Pool({
  user: 'michaeldigiorgio',
  host: 'localhost',
  database: 'pedometermap',
  password: '',
  port: 5432
})

module.exports = pool
