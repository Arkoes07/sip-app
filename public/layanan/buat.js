if(jenisUser !== 'admin' && jenisUser !== 'operator'){
    window.location.href = '/monitor'
}

const promptForm = $('#prompt-form')
const list = $('#pos-list')

hidePrompt()
loadPrompt()

$('#saveBtnPrompt').click((e) => {
    e.preventDefault()
    const choosen = $('input:radio:checked').val()
    if(typeof choosen === 'undefined' || choosen === null){
        alert('belum ada pos yang dipilih')
    }else{
        const text = `<li>${choosen}</li>`
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
    $('#pos-list li:last').remove();
})

$('#backBtn').click((e) => {
    e.preventDefault()
    if(confirm("anda yakin? data yang diisi belum disimpan.")){
        localStorage.removeItem('namaLayanan')
        window.location.href = '/layanan';
    }
})

$('#saveBtn').click((e) => {
    e.preventDefault()
    const posCollection = $( "#pos-list li" ).toArray()
    const posArr = posCollection.map(el => el.innerText)
    let data = {
        nama_layanan : $('#judul').val(),
        deskripsi : $('#deskripsi').val(),
        harga : $('#harga').val(),
        posArr,
    }
    saveData(data)
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
    const { nama_layanan, deskripsi, harga, posArr } = data
    $.ajax({ 
        url: "http://localhost:5000/api/layanan",
        type: "POST",
        data: { nama_layanan, deskripsi, harga },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${userToken}`);
        },
        success: function(data, status, jqXHR) {
            insertTerdiri(nama_layanan, posArr)
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

function insertTerdiri(nama_layanan, posArr){
    $.ajax({ 
        url: "http://localhost:5000/api/terdiri/group",
        type: "POST",
        data: { nama_layanan, posArr },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${userToken}`);
        },
        success: function(data, status, jqXHR) {
            window.location.href = '/layanan'
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
