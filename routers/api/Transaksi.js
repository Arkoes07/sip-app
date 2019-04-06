const Router = require('../Router')

class Transaksi extends Router {

    getServices() {
        return {
            'GET /'                         : 'getAll',
            'GET /today'                    : 'getAllToday',
            'POST /'                        : 'insertRow',
            'PUT /:no_transaksi'            : 'continueProgress',
            'DELETE /:no_transaksi'         : 'deleteRow'
        }
    }

    getAll(req, res)  {
        this.client.query('SELECT * FROM Transaksi no_transaksi', (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                res.json(result.rows);
            }
        })
    }

    getAllToday(req, res)  {
        this.client.query('SELECT * FROM Transaksi WHERE tanggal = CURRENT_DATE', (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                res.json(result.rows);
            }
        })
    }

    insertRow(req,res) {
        const text = 'INSERT INTO Transaksi (merk_mobil, no_kendaraan) values ($1, $2) RETURNING *'
        const values = [req.body.merk_mobil, req.body.no_kendaraan]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                res.json(result.rows);
            }
        })
    }

    continueProgress(req,res) {
        const text = 'SELECT * FROM lanjut_progres($1)'
        const values = [req.params.no_transaksi]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: 'tidak bisa lanjut karena sudah selesai atau masih menunggu giliran' })
            }else{
                res.json(result.rows)
            }
        })
    }

    deleteRow(req,res) {
        const text = 'DELETE FROM Transaksi WHERE no_transaksi = $1';
        const values = [req.params.no_transaksi];
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                res.json({ msg: 'deleted succesfully' })
            }
        })
    }

}

module.exports = Transaksi;