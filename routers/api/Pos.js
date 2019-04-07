const Router = require('../Router')

class Pos extends Router {

    getServices() {
        return {
            'GET /'         : 'getAll',
            'POST /'        : 'insertRow verifyToken',
            'PUT /'         : 'updateRow verifyToken',
            'DELETE /'      : 'deleteRow verifyToken'
        }
    }

    getAll(req, res)  {
        if(typeof req.query.nama_pos !== 'undefined' && req.query.nama_pos !== null){
            const text = 'SELECT * FROM Pos WHERE nama_pos = $1' 
            const values = [req.query.nama_pos]
            this.client.query(text, values, (err, result) => {
                if(err){
                    return res.status(400).json({  err: err.detail })
                }else{
                    res.json(result.rows);
                }
            })
        }else{
            this.client.query('SELECT * FROM Pos ORDER BY nama_pos', (err, result) => {
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

        let { nama_pos, deskripsi, durasi } = req.body

        const check = this.checkNewData(nama_pos,durasi)
        if(check.err){
            return res.status(400).json({ err : check.msg })
        }
        if(!deskripsi || /^\s*$/.test(deskripsi)){  
            deskripsi = null
        }

        const text = 'INSERT INTO Pos values ($1,$2,$3) RETURNING *'
        const values = [nama_pos, deskripsi, durasi]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({  err: err.detail })
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

        let { nama_pos, deskripsi, durasi, old_nama_pos } = req.body

        const check = this.checkNewData(nama_pos,durasi)
        if(check.err){
            return res.status(400).json({ err : check.msg })
        }
        if(!deskripsi || /^\s*$/.test(deskripsi)){  
            deskripsi = null
        }
        const text = 'UPDATE Pos SET nama_pos = $1, deskripsi = $2, durasi = $3 WHERE nama_pos = $4 RETURNING *'
        const values = [nama_pos, deskripsi, durasi, old_nama_pos]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({  err: err.detail })
            }else{
                res.json(result.rows);
            }
        })
    }

    deleteRow(req,res) {
        const jnsUsr = req.authData.user.jenisUser
        if(jnsUsr !== 'admin' && jnsUsr !== 'owner'){
            res.sendStatus(403)
        }
        
        const text = 'DELETE FROM Pos WHERE nama_pos = $1';
        const values = [req.body.nama_pos];
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err : err.detail })
            }else{
                res.json({ msg: 'deleted succesfully' })
            }
        })
    }

    checkNewData(nama_pos,durasi){
        if(!nama_pos || /^\s*$/.test(nama_pos)) {
            return { err : true, msg: 'nama pos harus diisi'}
        }
        if(durasi == 'NaN' || durasi <= 0){
            return { err : true, msg: 'durasi harus diisi dan lebih besar dari 0'}
        }
        return { err: false }
    }

}

module.exports = Pos;