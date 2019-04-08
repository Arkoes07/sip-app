if(jenisUser !== 'admin' && jenisUser !== 'owner'){
    window.location.href = '/monitor'
}

const idPekerja = parseInt(localStorage.getItem('idPekerja')) 
const promptForm = $('#prompt-form')
const list = $('#tugas-list')

if(typeof idPekerja == 'undefined' || idPekerja == null){
    localStorage.removeItem('idPekerja')
    window.location.href = '/pekerja'
}else{
    hidePrompt()
    loadPrompt()
}

$('#saveBtnPrompt').click((e) => {
    e.preventDefault()
    const posChoosen = $('input:radio[name="pos"]:checked').val()
    const hariChoosen = $('input:radio[name="hari"]:checked').val()
    if(typeof posChoosen === 'undefined' || typeof hariChoosen === 'undefined' || posChoosen === null || hariChoosen === null){
        alert('pos dan hari harus dipilih')
    }else{
        const text = `<li>${hariChoosen}: ${posChoosen}</li>`
        list.append(text)
        hidePrompt()
    }
})

$('#backBtnPrompt').click((e) => {
    e.preventDefault()
    hidePrompt()
})

$('#add').click((e) => {
    e.preventDefault()
    showPrompt()
})

$('#remove').click((e) => {
    e.preventDefault()
    $('#tugas-list li:last').remove();
})

$('#saveBtn').click((e) => {
    e.preventDefault()
    const collection = $( "#tugas-list li" ).toArray()
    const tugas = collection.map((el) => {
        colArr = el.innerText.split(': ')
        return {
            hari: colArr[0],
            nama_pos: colArr[1]
        }
    })
    let data = {
        nama_pekerja : $('#namaPekerja').val(),
        tugas
    }
    saveData(data)
})

$('#backBtn').click((e) => {
    e.preventDefault()
    if(confirm("anda yakin? data yang diisi belum disimpan.")){
        localStorage.removeItem('idPekerja')
        window.location.href = '/pekerja';
    }
})

function loadPrompt() {
    promptForm.empty()
    $.ajax({ 
        url: "http://localhost:5000/api/pos",
        type: "GET",
        success: function(data, status, jqXHR) {
            renderForm(data)
        },
        error: function(jqXHR, status, errorThrown) {
            if (status=='timeout') {
                console.log( 'request timed out.' );
            }
            else {
                alert(jqXHR.responseJSON.err)
            }
        },
        dataType: "json",
        timeout: 10000
    })
}

function renderForm(data){
    namaPos = data.map(each => each.nama_pos)
    let text = ''
    namaPos.forEach(element => {
        text += `<input type="radio" name="pos" value="${element}"> ${element}<br>`
    });
    promptForm.append(text)
}

function hidePrompt(){
    $('#prompt-pos').css('display','none');
}

function showPrompt(){
    $('#prompt-pos').css('display','flex');
}

function saveData(data){
    const { nama_pekerja, tugas } = data
    $.ajax({ 
        url: "http://localhost:5000/api/pekerja",
        type: "POST",
        data: { nama_pekerja },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${userToken}`);
        },
        success: function(data, status, jqXHR) {
            insertBertugas(data[0].id_pekerja, tugas)
        },
        error: function(jqXHR, status, errorThrown) {
            if (status=='timeout') {
                console.log( 'request timed out.' )
            }
            else {
                if(jqXHR.status == 403){
                    alert('forbidden')
                }else{
                    alert(jqXHR.responseJSON.err)
                }
            }
        },
        dataType: "json",
        timeout: 10000
    })
}

function insertBertugas(id_pekerja, tugas){
    $.ajax({ 
        url: "http://localhost:5000/api/bertugas/group",
        type: "POST",
        data: { id_pekerja, tugas : JSON.stringify(tugas) },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${userToken}`);
        },
        success: function(data, status, jqXHR) {
            window.location.href = '/pekerja'
        },
        error: function(jqXHR, status, errorThrown) {
            if (status=='timeout') {
                console.log( 'request timed out.' )
            }
            else {
                if(jqXHR.status == 403){
                    alert('forbidden')
                }else{
                    alert(jqXHR.responseJSON.err)
                }
            }
        },
        dataType: "json",
        timeout: 10000
    })
}

