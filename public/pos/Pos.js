class Pos {
    constructor (judul, deskripsi, durasi) {
        this.judul = judul
        this.durasi = durasi
        if(deskripsi){
            this.deskripsi = deskripsi
        }else{
            this.deskripsi = ""
        }
    }

    getElement(){
        const element =
        `
            <div class="sub-box">
                <div class="box-content nama">
                    <div>
                        <p class="judul">${this.judul}</p>
                        <p class="deskripsi">${this.deskripsi}</p>
                        <p>${this.durasi} Menit </p>
                    </div>
                </div>
                <div class="box-content aksi">
                    <button onclick="ubahData('${this.judul}')">UBAH</button>
                    <button onclick="deleteData('${this.judul}')" >HAPUS</button>
                </div>
            </div>
        `
        return element
    }
}