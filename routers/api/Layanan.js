const Router = require('../Router')

class Layanan extends Router {

    getServices() {
        return {
            'GET /'         : 'getAll',
            'POST /'        : 'insertRow',
            'PUT /'      : 'updateRow',
            'DELETE /'   : 'deleteRow'
        }
    }

    getAll(req, res)  {
        console.log(req.authData);
        this.client.query('SELECT * FROM Layanan', (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows);
            }
        })
    }

    insertRow(req,res) {
        const text = 'INSERT INTO Layanan values ($1,$2,$3) RETURNING *'
        const values = [req.body.nama_layanan, req.body.deskripsi, req.body.harga]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows);
            }
        })
    }

    updateRow(req,res) {
        const text = 'UPDATE Layanan SET nama_layanan = $1, deskripsi = $2, harga = $3 WHERE nama_layanan = $4 RETURNING *'
        const values = [req.body.nama_layanan, req.body.deskripsi, req.body.harga, req.body.old_nama_layanan]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows)
            }
        })
    }

    deleteRow(req,res) {
        const text = 'DELETE FROM Layanan WHERE nama_layanan = $1';
        const values = [req.body.nama_layanan];
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json({ msg: 'deleted succesfully' })
            }
        })
    }

}

module.exports = Layanan;