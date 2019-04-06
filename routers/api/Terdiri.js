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
        if(typeof req.query.nama_layanan !== 'undefined' && req.query.nama_layanan !== null){
            const text = 'SELECT * FROM Terdiri WHERE nama_layanan = $1 ORDER BY nama_layanan, urutan' 
            const values = [req.query.nama_layanan]
            this.client.query(text, values, (err, result) => {
                if(err){
                    return res.status(400).json({  err: err.detail })
                }else{
                    res.json(result.rows);
                }
            })
        }else{
            this.client.query('SELECT * FROM Terdiri ORDER BY nama_layanan, urutan', (err, result) => {
                if(err){
                    return res.status(400).json({ err: err.detail })
                }else{
                    res.json(result.rows);
                }
            })
        }
    }

    insertRow(req,res) {
        const { nama_layanan, urutan, nama_pos } = req.body
        const check = this.checkNewData(nama_layanan, urutan, nama_pos)
        if(check.err){
            return res.status(400).json({ err : check.msg })
        }
        const text = 'INSERT INTO Terdiri values ($1,$2,$3) RETURNING *'
        const values = [nama_layanan, urutan, nama_pos]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detal })
            }else{
                res.json(result.rows);
            }
        })
    }

    updateRow(req,res) {
        const { nama_layanan, urutan, nama_pos, old_nama_layanan, old_urutan } = req.body
        const check = this.checkNewData(nama_layanan, urutan, nama_pos)
        if(check.err){
            return res.status(400).json({ err : check.msg })
        }
        const text = 'UPDATE Terdiri SET nama_layanan = $1, urutan = $2, nama_pos = $3 WHERE nama_layanan = $4 AND urutan = $5  RETURNING *'
        const values = [nama_layanan, urutan, nama_pos, old_nama_layanan, old_urutan]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detal })
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
                return res.status(400).json({ err: err.detal })
            }else{
                res.json({ msg: 'deleted succesfully' })
            }
        })
    }

    checkNewData(nama_layanan,urutan,nama_pos){
        if(!nama_layanan || /^\s*$/.test(nama_layanan)) {
            return { err : true, msg: 'nama layanan harus diisi'}
        }
        if(urutan == 'NaN' || urutan <= 0){
            return { err : true, msg: 'urutan harus diisi dan lebih besar dari 0'}
        }
        if(!nama_pos || /^\s*$/.test(nama_pos)) {
            return { err : true, msg: 'nama pos harus diisi'}
        }
        return { err: false }
    }

}

module.exports = Terdiri;