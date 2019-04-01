const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'sip',
  password: '',
  port: 5432,
})

module.exports = client;