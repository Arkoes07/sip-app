class Layanan {
    constructor (judul, deskripsi, harga, pos) {
        this.judul = judul
        this.harga = harga
        if(deskripsi){
            this.deskripsi = deskripsi
        }else{
            this.deskripsi = ""
        }
        this.pos = pos
    }

    getElement(){
        let posString = ''
        if(this.pos.join().replace(/,/g,'').length !== 0){
            this.pos.forEach(element => {
                posString += `${element}</br>`
            });
        }
        const element =
        `
            <div class="sub-box">
                <div class="box-content nama">
                    <div>
                        <p class="judul">${this.judul}</p>
                        <p class="deskripsi">${this.deskripsi}</p>
                    </div>
                </div>
                <div class="box-content keterangan">
                    <p>${posString}</p>   
                </div>
                <div class="box-content keterangan harga">
                    <p class="harga">Harga = ${this.harga}</p>
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