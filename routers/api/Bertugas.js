const Router = require('../Router')

class Bertugas extends Router {

    getServices() {
        return {
            'GET /'         : 'getAll',
            'POST /'        : 'insertRow',
            'PUT /'         : 'updateRow',
            'DELETE /'      : 'deleteRow'
        }
    }

    getAll(req, res)  {
        this.client.query('SELECT * FROM Bertugas', (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows);
            }
        })
    }

    insertRow(req,res) {
        const text = 'INSERT INTO Bertugas values ($1,$2,$3) RETURNING *'
        const values = [req.body.id_pekerja, req.body.hari, req.body.nama_pos]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows);
            }
        })
    }

    updateRow(req,res) {
        const text = 'UPDATE Bertugas SET id_pekerja = $1, hari = $2, nama_pos = $3 WHERE id_pekerja = $4 AND hari = $5  RETURNING *'
        const values = [req.body.id_pekerja, req.body.hari, req.body.nama_pos, req.body.old_id_pekerja, req.body.old_hari]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows)
            }
        })
    }

    deleteRow(req,res) {
        const text = 'DELETE FROM Bertugas WHERE id_pekerja = $1 AND hari = $2';
        const values = [req.body.id_pekerja, req.body.hari];
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json({ msg: 'deleted succesfully' })
            }
        })
    }

}

module.exports = Bertugas;