const express = require('express')
const path = require('path')

const app = express()

// initialize body-parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname,'public')))

const Pos = require('./routers/api/Pos')
const pos = new Pos('/api/pos', app)

const Layanan = require('./routers/api/Layanan')
const layanan = new Layanan('/api/layanan', app)

const Pekerja = require('./routers/api/Pekerja')
const pekerja = new Pekerja('/api/pekerja', app)

const Transaksi = require('./routers/api/Transaksi')
const transaksi = new Transaksi('/api/transaksi', app)

const Terdiri = require('./routers/api/Terdiri')
const terdiri = new Terdiri('/api/terdiri', app)

const Bertugas = require('./routers/api/Bertugas')
const bertugas = new Bertugas('/api/bertugas', app)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))