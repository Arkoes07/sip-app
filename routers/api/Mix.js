const Router = require('../Router')

class Mix extends Router {

    getServices() {
        return {
            'GET /detailLayanan' : 'detailLayanan',
            'GET /detailPekerja' : 'detailPekerja'
        }
    }

    detailLayanan(req, res){
        this.client.query('SELECT * FROM Layanan LEFT JOIN Terdiri USING (nama_layanan) ORDER BY nama_layanan, urutan', (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                const data = result.rows.map((layanan) => {
                    // return layanan.nama_layanan
                    return { 
                        nama_layanan : layanan.nama_layanan,
                        deskripsi : layanan.deskripsi,
                        harga : layanan.harga
                    }
                }).filter((value, index, self) => {
                    let condition = true ;
                    for (const [i,el] of self.entries()){
                        if(el.nama_layanan === value.nama_layanan){
                            if(i !== index){
                                condition = false
                            }
                            break
                        }
                    }
                    return condition
                })
                for (const [i, el] of data.entries()){
                    let pos = []
                    result.rows.forEach((layanan) => {
                        if(layanan.nama_layanan === el.nama_layanan){
                            pos.push(layanan.nama_pos)
                        }
                    })
                    data[i]["pos"] = pos
                }
                return res.json(data)
            }
        })
    }

    detailPekerja(req, res){
        this.client.query('SELECT * FROM Pekerja LEFT JOIN Bertugas USING (id_pekerja) ORDER BY id_pekerja, hari', (err, result) => {
            if(err){
                return res.status(400).json({ err: err.detail })
            }else{
                const data = result.rows.map((kerja) => {
                    return { 
                        id_pekerja : kerja.id_pekerja,
                        nama_pekerja : kerja.nama_pekerja
                    }
                }).filter((value, index, self) => {
                    let condition = true ;
                    for (const [i,el] of self.entries()){
                        if(el.id_pekerja === value.id_pekerja){
                            if(i !== index){
                                condition = false
                            }
                            break
                        }
                    }
                    return condition
                })
                for (const [i, el] of data.entries()){
                    let tugas = []
                    result.rows.forEach((kerja) => {
                        if(kerja.id_pekerja === el.id_pekerja){
                            tugas.push({
                                hari : kerja.hari,
                                nama_pos : kerja.nama_pos
                            })
                        }
                    })
                    data[i]["tugas"] = tugas
                }
                return res.json(data)
            }
        })
    }
}

module.exports = Mix;