const express = require('express')
const path = require('path')
const app = express()

// Routers
const Pos = require('./routers/api/Pos')
const Layanan = require('./routers/api/Layanan')
const Pekerja = require('./routers/api/Pekerja')
const Transaksi = require('./routers/api/Transaksi')
const Terdiri = require('./routers/api/Terdiri')
const Bertugas = require('./routers/api/Bertugas')
const Pengguna = require('./routers/api/Pengguna')

// initialize body-parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Use static file
app.use(express.static(path.join(__dirname,'public')))

// Instantiate Routers
const pos = new Pos('/api/pos', app)
const layanan = new Layanan('/api/layanan', app)
const pekerja = new Pekerja('/api/pekerja', app)
const transaksi = new Transaksi('/api/transaksi', app)
const terdiri = new Terdiri('/api/terdiri', app)
const bertugas = new Bertugas('/api/bertugas', app)
const pengguna = new Pengguna('/api/pengguna', app)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))