const Router = require('../Router')

class Bertugas extends Router {

    getServices() {
        return {
            'GET /'         : 'getAll',
            'POST /'        : 'insertRow verifyToken',
            'POST /group'   : 'upsertRow verifyToken',
            'PUT /'         : 'updateRow verifyToken',
            'DELETE /'      : 'deleteRow verifyToken'
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
        const jnsUsr = req.authData.user.jenisUser
        if(jnsUsr !== 'admin' && jnsUsr !== 'owner'){
            res.sendStatus(403)
        }
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

    async upsertRow(req, res) {
        const jnsUsr = req.authData.user.jenisUser
        if(jnsUsr !== 'admin' && jnsUsr !== 'owner'){
            res.sendStatus(403)
        }
        const id_pekerja = req.body.id_pekerja
        const tugasArr = JSON.parse(req.body.tugas)
        // console.log(id_pekerja,tugasArr)
        try{
            let hariArr = []
            await this.client.query("BEGIN")
            for(let i in tugasArr){
                const hari = tugasArr[i].hari
                const nama_pos = tugasArr[i].nama_pos
                hariArr.push(hari)
                const text = `INSERT INTO Bertugas VALUES ($1,$2,$3) ON CONFLICT (id_pekerja, hari) DO UPDATE SET nama_pos = $3`
                const values = [id_pekerja, hari, nama_pos]
                await this.client.query(text,values)
            }
            let arrLength = hariArr.length
            if(arrLength != 0){
                let textTwo = "DELETE FROM Bertugas WHERE id_pekerja = $1 AND hari NOT IN ("
                for (let i = 0; i < arrLength; i++){
                    textTwo += `$${i + 2}`
                    i === arrLength - 1 ? textTwo += ")" : textTwo += ","
                }
                await this.client.query(textTwo,[id_pekerja].concat(hariArr))
            }else{
                let textTwo = "DELETE FROM Bertugas WHERE id_pekerja = $1"
                await this.client.query(textTwo,[id_pekerja])
            }
            // console.log(textTwo)
            await this.client.query("COMMIT")
        }
        catch (ex){
            // console.log(ex)
            await this.client.query("ROLLBACK")
            return res.status(400).json({err : ex.detail})
        }
        finally{
            res.status(200).json({msg : 'berhasil upsert'})
        }
    }

    updateRow(req,res) {
        const jnsUsr = req.authData.user.jenisUser
        if(jnsUsr !== 'admin' && jnsUsr !== 'owner'){
            res.sendStatus(403)
        }
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
        const jnsUsr = req.authData.user.jenisUser
        if(jnsUsr !== 'admin' && jnsUsr !== 'owner'){
            res.sendStatus(403)
        }
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