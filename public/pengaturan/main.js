let name = document.getElementById('nama');
let desc = document.getElementById('deskripsi');
let saveBtn = document.getElementById('simpan');

saveBtn.addEventListener('click', () =>{
    console.log(name.value, desc.value);
});

document.getElementById('pos').addEventListener('click', () => {console.log("Pos clicked!")});

document.getElementById('layanan').addEventListener('click', () => {console.log("Service clicked!")});

