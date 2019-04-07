class Pekerja {
    constructor (id, judul, tugas) {
        this.judul = judul
        this.id = id
        this.tugas = tugas
    }

    getElement(){
        let tugasString = ''
        this.tugas.forEach(element => {
            tugasString += `${element.hari} : ${element.nama_pos}</br>`
        });
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
                    <button onclick="ubahData('${this.id}')">UBAH</button>
                    <button onclick="deleteData('${this.id}')">HAPUS</button>
                </div>
            </div>
        `
        return element
    }
}