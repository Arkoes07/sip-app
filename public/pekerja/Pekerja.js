class Pekerja {
    constructor (id, judul, tugas) {
        this.judul = judul
        this.id = id
        this.tugas = tugas
    }

    getElement(){
        let tugasString = ''
        if(this.tugas.length != 1 || this.tugas[0].nama_pos != null ) {
                this.tugas.forEach(element => {
                    tugasString += `${element.hari} : ${element.nama_pos}</br>`
                });
        }
        const element =
        `
            <div class="sub-box">
                <div class="box-content nama">
                    <div>
                        <p class="judul">${this.judul}</p>
                        <p class="deskripsi">id :${this.id}</p>
                    </div>
                </div>
                <div class="box-content keterangan">
                    <p>${tugasString}</p>   
                </div>
                <div class="box-content aksi">
                    <button onclick="ubahData('${this.id}')" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored"><i class="far fa-edit"></i>UBAH</button>
                    <button onclick="deleteData('${this.id}')" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"><i class="far fa-trash-alt"></i>HAPUS</button>
                </div>
            </div>
        `
        return element
    }
}