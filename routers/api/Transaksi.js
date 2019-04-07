const Router = require('../Router')

class Transaksi extends Router {

    getServices() {
        return {
            'GET /'                         : 'getAll',
            'GET /today'                    : 'getAllToday',
            'POST /'                        : 'insertRow verifyToken',
            'PUT /:no_transaksi'            : 'continueProgress verifyToken',
            'DELETE /:no_transaksi'         : 'deleteRow verifyToken'
        }
    }

    getAll(req, res)  {
        this.client.query('SELECT * FROM Transaksi no_transaksi', (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                res.json(result.rows);
            }
        })
    }

    getAllToday(req, res)  {
        this.client.query('SELECT * FROM Transaksi WHERE tanggal = CURRENT_DATE ORDER BY selesai, jam_masuk ASC', (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                res.json(result.rows);
            }
        })
    }

    insertRow(req,res) {
        const jnsUsr = req.authData.user.jenisUser
        if(jnsUsr !== 'admin' && jnsUsr !== 'operator'){
            res.sendStatus(403)
        }
        
        let { merk_mobil, no_kendaraan, nama_layanan } = req.body
        if(!merk_mobil || /^\s*$/.test(merk_mobil)){  
            merk_mobil = null
        }
        if(!no_kendaraan || /^\s*$/.test(no_kendaraan)){  
            no_kendaraan = null
        }
        const check = this.checkNewData(merk_mobil, no_kendaraan)
        if(check.err){
            return res.status(400).json({ err : check.msg })
        }
        if(!nama_layanan || /^\s*$/.test(nama_layanan)){  
            return res.status(400).json({ err: 'layanan harus dipilih' })
        }

        const text = 'INSERT INTO Transaksi (merk_mobil, no_kendaraan, nama_layanan) values ($1, $2, $3) RETURNING *'
        const values = [req.body.merk_mobil, req.body.no_kendaraan, req.body.nama_layanan]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: err.where })
            }else{
                res.json(result.rows);
            }
        })
    }

    continueProgress(req,res) {
        const jnsUsr = req.authData.user.jenisUser
        if(jnsUsr !== 'admin' && jnsUsr !== 'operator'){
            res.sendStatus(403)
        }

        const text = 'SELECT * FROM lanjut_progres($1)'
        const values = [req.params.no_transaksi]
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: 'tidak bisa lanjut karena sudah selesai atau masih menunggu giliran' })
            }else{
                res.json(result.rows)
            }
        })
    }

    deleteRow(req,res) {
        const jnsUsr = req.authData.user.jenisUser
        if(jnsUsr !== 'admin' && jnsUsr !== 'operator'){
            res.sendStatus(403)
        }

        const text = 'DELETE FROM Transaksi WHERE no_transaksi = $1';
        const values = [req.params.no_transaksi];
        this.client.query(text, values, (err, result) => {
            if(err){
                return res.status(400).json({ err: 'tidak bisa dihapus karena masih dalam proses pengerjaan' })
            }else{
                res.json({ msg: 'deleted succesfully' })
            }
        })
    }

    checkNewData(merk_mobil,no_kendaraan){
        if(merk_mobil == no_kendaraan){
            return { err : true, msg: 'salah satu dari merk kendaraan dan nomor kendaraan harus diisi' }
        }else{
            return { err: false }
        }
    }

}

module.exports = Transaksi;