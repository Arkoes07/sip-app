const Router = require('../Router')

class Pekerja extends Router {

    getServices() {
        return {
            'GET /'                 : 'getAll',
            'GET /:id_pekerja'      : 'getOne',
            'POST /'                : 'insertRow verifyToken',
            'PUT /:id_pekerja'      : 'updateRow verifyToken',
            'DELETE /:id_pekerja'   : 'deleteRow verifyToken'
        }
    }

    getAll(req, res)  {
        this.client.query('SELECT * FROM Pekerja ORDER BY id_pekerja', (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                res.json(result.rows);
            }
        })
    }

    getOne(req, res)  {
        const text = 'SELECT * FROM Pekerja WHERE id_pekerja = $1';
        const values = [req.params.id_pekerja];
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                res.json(result.rows);
            }
        })
    }

    insertRow(req,res) {
        const jnsUsr = req.authData.user.jenisUser
        if(jnsUsr !== 'admin' && jnsUsr !== 'owner'){
            res.sendStatus(403)
        }

        const check = this.checkNewData(req.body.nama_pekerja)
        if(check.err){
            return res.status(400).json({ err : check.msg })
        }
        const text = 'INSERT INTO Pekerja (nama_pekerja) values ($1) RETURNING *'
        const values = [req.body.nama_pekerja]
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

        const check = this.checkNewData(req.body.nama_pekerja)
        if(check.err){
            return res.status(400).json({ err : check.msg })
        }
        const text = 'UPDATE Pekerja SET nama_pekerja = $1 WHERE id_pekerja = $2 RETURNING *'
        const values = [req.body.nama_pekerja, req.params.id_pekerja]
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
        
        const text = 'DELETE FROM Pekerja WHERE id_pekerja = $1';
        const values = [req.params.id_pekerja];
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                res.json({ msg: 'deleted succesfully' })
            }
        })
    }

    checkNewData(nama_pekerja){
        if(!nama_pekerja || /^\s*$/.test(nama_pekerja)) {
            return { err : true, msg: 'nama pekerja harus diisi'}
        }
        return { err: false }
    }

}

module.exports = Pekerja;