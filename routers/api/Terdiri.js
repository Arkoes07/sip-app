const Router = require('../Router')

class Terdiri extends Router {

    getServices() {
        return {
            'GET /'         : 'getAll',
            'POST /'        : 'insertRow',
            'PUT /'         : 'updateRow',
            'DELETE /'      : 'deleteRow'
        }
    }

    getAll(req, res)  {
        this.client.query('SELECT * FROM Terdiri', (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows);
            }
        })
    }

    insertRow(req,res) {
        const text = 'INSERT INTO Terdiri values ($1,$2,$3) RETURNING *'
        const values = [req.body.nama_layanan, req.body.urutan, req.body.nama_pos]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows);
            }
        })
    }

    updateRow(req,res) {
        const text = 'UPDATE Terdiri SET nama_layanan = $1, urutan = $2, nama_pos = $3 WHERE nama_layanan = $4 AND urutan = $5  RETURNING *'
        const values = [req.body.nama_layanan, req.body.urutan, req.body.nama_pos, req.body.old_nama_layanan, req.body.old_urutan]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows)
            }
        })
    }

    deleteRow(req,res) {
        const text = 'DELETE FROM Terdiri WHERE nama_layanan = $1 AND urutan = $2';
        const values = [req.body.nama_layanan, req.body.urutan];
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json({ msg: 'deleted succesfully' })
            }
        })
    }

}

module.exports = Terdiri;