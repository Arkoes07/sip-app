if(jenisUser !== 'admin' && jenisUser !== 'owner'){
    window.location.href = '/monitor'
}

const namaLayanan = localStorage.getItem('namaLayanan')
const promptForm = $('#prompt-form')
const list = $('#pos-list')

if(typeof namaLayanan == 'undefined' || namaLayanan == null){
    localStorage.removeItem('namaLayanan')
    window.location.href = '/layanan'
}else{
    hidePrompt()
    loadData()
    loadPrompt()
}

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
        old_nama_layanan : namaLayanan
    }
    saveData(data)
})

function loadData() {
    $.ajax({ 
        url: "http://localhost:5000/api/mix/detailLayanan",
        type: "GET",
        success: function(data, status, jqXHR) {
            renderData(data)
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

function renderData(data){
    let content = data.filter(each => each.nama_layanan === namaLayanan)
    $('#judul').val(content[0].nama_layanan),
    $('#deskripsi').val(content[0].deskripsi),
    $('#harga').val(content[0].harga)
    // console.log(content[0].pos)
    if(content[0].pos.join().replace(/,/g,'').length !== 0){
        content[0].pos.forEach((nama) => {
            const textpos = `<li>${nama}</li>`
            list.append(textpos)
        })
    }
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
    const { nama_layanan, deskripsi, harga, old_nama_layanan, posArr } = data
    $.ajax({ 
        url: "http://localhost:5000/api/layanan",
        type: "PUT",
        data: { nama_layanan, deskripsi, harga, old_nama_layanan },
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

