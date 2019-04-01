const Router = require('../Router')

class Pos extends Router {

    getServices() {
        return {
            'GET /'         : 'getAll',
            'POST /'        : 'insertRow',
            'PUT /'      : 'updateRow',
            'DELETE /'   : 'deleteRow'
        }
    }

    getAll(req, res)  {
        this.client.query('SELECT * FROM Pos', (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows);
            }
        })
    }

    insertRow(req,res) {
        const text = 'INSERT INTO Pos values ($1,$2,$3) RETURNING *'
        const values = [req.body.nama_pos, req.body.deskripsi, req.body.durasi]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows);
            }
        })
    }

    updateRow(req,res) {
        const text = 'UPDATE Pos SET nama_pos = $1, deskripsi = $2, durasi = $3 WHERE nama_pos = $4 RETURNING *'
        const values = [req.body.nama_pos, req.body.deskripsi, req.body.durasi, req.body.old_nama_pos]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows)
            }
        })
    }

    deleteRow(req,res) {
        const text = 'DELETE FROM Pos WHERE nama_pos = $1';
        const values = [req.body.nama_pos];
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json({ msg: 'deleted succesfully' })
            }
        })
    }

}

module.exports = Pos;