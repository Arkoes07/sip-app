const Router = require('../Router')

class Pekerja extends Router {

    getServices() {
        return {
            'GET /'         : 'getAll',
            'POST /'        : 'insertRow',
            'PUT /:id_pekerja'      : 'updateRow',
            'DELETE /:id_pekerja'   : 'deleteRow'
        }
    }

    getAll(req, res)  {
        this.client.query('SELECT * FROM Pekerja', (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows);
            }
        })
    }

    insertRow(req,res) {
        const text = 'INSERT INTO Pekerja (nama_pekerja) values ($1) RETURNING *'
        const values = [req.body.nama_pekerja]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows);
            }
        })
    }

    updateRow(req,res) {
        const text = 'UPDATE Pekerja SET nama_pekerja = $1 WHERE id_pekerja = $2 RETURNING *'
        const values = [req.body.nama_pekerja, req.params.id_pekerja]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json(result.rows)
            }
        })
    }

    deleteRow(req,res) {
        const text = 'DELETE FROM Pekerja WHERE id_pekerja = $1';
        const values = [req.params.id_pekerja];
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err })
            }else{
                res.json({ msg: 'deleted succesfully' })
            }
        })
    }

}

module.exports = Pekerja;