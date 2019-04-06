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
        this.client.query('SELECT * FROM Bertugas ORDER BY id_pekerja, hari', (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                res.json(result.rows);
            }
        })
    }

    insertRow(req,res) {

        const { id_pekerja, hari, nama_pos } = req.body
        const check = this.checkNewData(id_pekerja, hari, nama_pos)
        if(check.err){
            return res.status(400).json({ err : check.msg })
        }
    
        const text = 'INSERT INTO Bertugas values ($1,$2,$3) RETURNING *'
        const values = [id_pekerja, hari, nama_pos]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                res.json(result.rows);
            }
        })
    }

    updateRow(req,res) {
        const { id_pekerja, hari, nama_pos, old_id_pekerja, old_hari } = req.body
        const check = this.checkNewData(id_pekerja, hari, nama_pos)
        if(check.err){
            return res.status(400).json({ err : check.msg })
        }
        const text = 'UPDATE Bertugas SET id_pekerja = $1, hari = $2, nama_pos = $3 WHERE id_pekerja = $4 AND hari = $5  RETURNING *'
        const values = [id_pekerja, hari, nama_pos, old_id_pekerja, old_hari]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
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
                return res.status(400).json({ err: err.detail })
            }else{
                res.json({ msg: 'deleted succesfully' })
            }
        })
    }

    checkNewData(id_pekerja,hari,nama_pos){
        if(id_pekerja == 'NaN' || id_pekerja <= 0){
            return { err : true, msg: 'id pekerja harus diisi dan lebih besar dari 0'}
        }
        if(!hari || /^\s*$/.test(hari)) {
            return { err : true, msg: 'hari harus diisi' }
        }
        if(!nama_pos || /^\s*$/.test(nama_pos)) {
            return { err : true, msg: 'nama pos harus diisi' }
        }
        return { err: false }
    }

}

module.exports = Bertugas;