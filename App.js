const express = require('express')
const path = require('path')
const app = express()
const cron = require('node-cron')
const client = require('./config/db')
const http = require('http').Server(app)
const io = require('socket.io')(http)

// Routers
const Pos = require('./routers/api/Pos')
const Layanan = require('./routers/api/Layanan')
const Pekerja = require('./routers/api/Pekerja')
const Transaksi = require('./routers/api/Transaksi')
const Terdiri = require('./routers/api/Terdiri')
const Bertugas = require('./routers/api/Bertugas')
const Pengguna = require('./routers/api/Pengguna')
const Mix = require('./routers/api/Mix')

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
const mix = new Mix('/api/mix', app)

// cron job at 00:01 am
cron.schedule('1 0 * * *', () => {
    client.query('SELECT * FROM selesaikan_transaksi_kemarin()', (err, result) => {
        if(err){
            console.log(err)
        }else{
            console.log(result.rows)
        }
    })
});

// notification from postgress
client.query('LISTEN perubahantransaksi')
io.on('connection', function(socket){
    // console.log('a user connected')
    socket.emit('connected', { connected: true })
    
    socket.on('ready for data', function(data) {
      client.on('notification',function(title){
        socket.emit('update', { message: title })
      })
    })
});

// Start server
const PORT = process.env.PORT || 5000
http.listen(PORT, () => console.log(`Server started on port ${PORT}`))
