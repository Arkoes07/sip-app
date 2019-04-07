class Layanan {
    constructor(data){
        const {no_transaksi, no_kendaraan, merk_mobil, nama_layanan, nama_pos, antre, jam_masuk, jam_selesai, selesai} = data
        this.no = no_transaksi
        this.noKendaraan = no_kendaraan
        this.merk = merk_mobil
        this.namaLayanan = nama_layanan
        if(!selesai){
            this.namaPos = nama_pos
            this.antre = parseInt(antre)
        }else{
            this.namaPos = ''
            this.antre = ''
        }
        this.jamMasuk = jam_masuk.split('.')[0]
        if(typeof jam_selesai === 'undefined' || jam_selesai === null || /^\s*$/.test(jam_selesai)){
            this.jamSelesai = ''
        }else{
            this.jamSelesai = jam_selesai.split('.')[0]
        }
        this.selesai = selesai
    }

    getElement() {
        let classChoosen = ''
        if(this.selesai){
            classChoosen = 'selesai'
        }else if(this.antre == 1){
            classChoosen = 'proses'
        }
        const element = 
        `
            <div class="sub-box ${classChoosen}">
                <div class="box-content nama">
                    <div>
                        <p class="judul">NO : ${this.no}</p>
                        <p>${this.noKendaraan}</p>
                        <p>${this.merk}</p>
                    </div>
                </div>
                <div class="box-content nama">
                    <div>
                        <p>LAYANAN : ${this.namaLayanan}</p>
                        <p>POS : ${this.namaPos}</p>
                        <p>antrean ke : ${this.antre}</p>
                    </div>
                </div>
                <div class="box-content nama">
                    <div>
                        <p>jam masuk : ${this.jamMasuk}</p>
                        <p>jam selesai : ${this.jamSelesai}</p>
                    </div>
                </div>
                <div class="box-content aksi">
                    <button onclick="ubahData('${this.no}')">LANJUT</button>
                    <button onclick="deleteData('${this.no}')" >HAPUS</button>
                </div>
            </div>
        `
        return element
    }
}

    