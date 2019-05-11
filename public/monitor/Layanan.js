class Layanan {
    constructor(data){
        const {no_transaksi, no_kendaraan, merk_mobil, nama_layanan, nama_pos, antre, jam_masuk, jam_selesai, selesai, urutan_pos, byk_urutan, durasi} = data
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
        this.urutanPos = parseInt(urutan_pos)
        this.bykUrutan = parseInt(byk_urutan)
        this.durasi = parseInt(durasi)
    }

    getElement() {
        let classChoosen = ''
        let waktu = ''
        let progres = 0;
        if(this.selesai){
            classChoosen = 'selesai'
        }else{ 
            if(this.antre == 1){
                classChoosen = 'proses'
            }
            waktu = this.durasi*this.antre
        }
        if(this.urutanPos != 1){
            progres = (((this.urutanPos - 1)*100)/this.bykUrutan).toFixed(2)     
        }
        if(this.selesai && this.urutanPos == this.bykUrutan){
            progres = 100;
        }
        waktu = this.durasi*this.antre
        


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
                <div class="box-content progress">
                    <div>
                        <p class="judul">progres : ${progres}% </p>
                        <p>sekarang tahap : ${this.urutanPos}</p>
                        <p>total tahap : ${this.bykUrutan}</p>
                        <p>waktu ke tahap berikut : ${waktu} menit</p>
                    </div>
                </div>
            </div>
        `
        return element
    }
}

    