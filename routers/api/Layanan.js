const Router = require('../Router')

class Layanan extends Router {

    getServices() {
        return {
            'GET /'         : 'getAll',
            'POST /'        : 'insertRow verifyToken',
            'PUT /'         : 'updateRow verifyToken',
            'DELETE /'      : 'deleteRow verifyToken'
        }
    }

    getAll(req, res)  {
        if(typeof req.query.nama_layanan !== 'undefined' && req.query.nama_layanan !== null){
            const text = 'SELECT * FROM Layanan WHERE nama_layanan = $1' 
            const values = [req.query.nama_layanan]
            this.client.query(text, values, (err, result) => {
                if(err){
                    return res.status(400).json({  err: err.detail })
                }else{
                    res.json(result.rows);
                }
            })
        }else{
            this.client.query('SELECT * FROM Layanan ORDER BY nama_layanan', (err, result) => {
                if(err){
                    return res.status(400).json({ err: err.detail })
                }else{
                    res.json(result.rows);
                }
            })
        }
        
    }

    insertRow(req,res) {
        const jnsUsr = req.authData.user.jenisUser
        if(jnsUsr !== 'admin' && jnsUsr !== 'owner'){
            res.sendStatus(403)
        }

        let { nama_layanan, deskripsi, harga } = req.body

        const check = this.checkNewData(nama_layanan,harga)
        if(check.err){
            return res.status(400).json({ err : check.msg })
        }
        if(!deskripsi || /^\s*$/.test(deskripsi)){  
            deskripsi = null
        }

        const text = 'INSERT INTO Layanan values ($1,$2,$3) RETURNING *'
        const values = [req.body.nama_layanan, req.body.deskripsi, req.body.harga]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                res.json(result.rows);
            }
        })
    }

    updateRow(req,res) {
        const jnsUsr = req.authData.user.jenisUser
        if(jnsUsr !== 'admin' && jnsUsr !== 'owner'){
            res.sendStatus(403)
        }

        let { nama_layanan, deskripsi, harga, old_nama_layanan } = req.body
        const check = this.checkNewData(nama_layanan,harga)
        if(check.err){
            return res.status(400).json({ err : check.msg })
        }
        if(!deskripsi || /^\s*$/.test(deskripsi)){  
            deskripsi = null
        }
        const text = 'UPDATE Layanan SET nama_layanan = $1, deskripsi = $2, harga = $3 WHERE nama_layanan = $4 RETURNING *'
        const values = [nama_layanan, deskripsi, harga, old_nama_layanan]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                res.json(result.rows)
            }
        })
    }

    deleteRow(req,res) {
        const jnsUsr = req.authData.user.jenisUser
        if(jnsUsr !== 'admin' && jnsUsr !== 'owner'){
            res.sendStatus(403)
        }
        
        const text = 'DELETE FROM Layanan WHERE nama_layanan = $1';
        const values = [req.body.nama_layanan];
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                res.json({ msg: 'deleted succesfully' })
            }
        })
    }

    checkNewData(nama_layanan,harga){
        if(!nama_layanan || /^\s*$/.test(nama_layanan)) {
            return { err : true, msg: 'nama layanan harus diisi'}
        }
        if(harga == 'NaN' || harga <= 0){
            return { err : true, msg: 'harga harus diisi dan lebih besar dari 0'}
        }
        return { err: false }
    }

}

module.exports = Layanan;