const Router = require('../Router')

class Transaksi extends Router {

    getServices() {
        return {
            'GET /'                         : 'getAll',
            'POST /'                        : 'insertRow',
            'PUT /selesai/:no_transaksi'    : 'setToFinished',
            'DELETE /:no_transaksi'         : 'deleteRow'
        }
    }

    getAll(req, res)  {
        this.client.query('SELECT * FROM Transaksi', (err, result) => {
            if(err){
                return res.status(400).json({ err })
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
                return res.status(400).json({ err })
            }else{
                res.json(result.rows);
            }
        })
    }

    setToFinished(req,res) {
        const text = 'UPDATE Transaksi SET selesai = TRUE WHERE no_transaksi = $1 RETURNING *'
        const values = [req.params.no_transaksi]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
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
                return res.status(400).json({ err })
            }else{
                res.json({ msg: 'deleted succesfully' })
            }
        })
    }

}

module.exports = Transaksi;