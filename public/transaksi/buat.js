if(jenisUser !== 'admin' && jenisUser !== 'operator'){
    window.location.href = '/monitor'
}

const promptForm = $('#prompt-form')

loadPrompt()

$('#saveBtnPrompt').click((e) => {
    e.preventDefault()
    const layananChoosen = $('input:radio[name="pos"]:checked').val()
    if(typeof layananChoosen === 'undefined' || layananChoosen === null){
        alert('layanan harus dipilih')
    }else{
        $('#layanan-terpilih').html(layananChoosen)
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

$('#backBtn').click((e) => {
    e.preventDefault()
    if(confirm("anda yakin? data yang diisi belum disimpan.")){
        window.location.href = '/transaksi';
    }
})

$('#saveBtn').click((e) => {
    e.preventDefault()

    let data = {
        merk_mobil : $('#merk').val(),
        no_kendaraan : $('#nomor').val(),
        nama_layanan : $('#layanan-terpilih').html(),
    }
    if(typeof data.merk_mobil === 'undefined' || data.merk_mobil === null || /^\s*$/.test(data.merk_mobil)){
        if(!confirm("anda yakin? merk kendaraan belum diisi.")){
            return null
        }
    }
    if(typeof data.no_kendaraan === 'undefined' || data.no_kendaraan === null || /^\s*$/.test(data.no_kendaraan)){
        if(!confirm("anda yakin? nomor kendaraan belum diisi.")){
            return null
        }
    }
    if(typeof data.nama_layanan === 'undefined' || data.nama_layanan === null || /^\s*$/.test(data.nama_layanan)){
        alert("layanan harus dipiih")
        return null
    }
    console.log(data)

    $.ajax({ 
        url: "http://localhost:5000/api/transaksi",
        type: "POST",
        data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${userToken}`);
        },
        success: function(data, status, jqXHR) {
            window.location.href = '/transaksi';
        },
        error: function(jqXHR, status, errorThrown) {
            if (status=='timeout') {
                console.log( 'request timed out.' );
            }
            else {
                console.log(jqXHR);
                console.log(errorThrown);
                alert(jqXHR.responseJSON.err);
            }
        },
        dataType: "json",
        timeout: 10000
    })
})

function hidePrompt(){
    $('#prompt-pos').css('display','none');
}

function showPrompt(){
    $('#prompt-pos').css('display','flex');
}

function loadPrompt() {
    promptForm.empty()
    $.ajax({ 
        url: "http://localhost:5000/api/layanan",
        type: "GET",
        success: function(data, status, jqXHR) {
            renderForm(data)
        },
        error: function(jqXHR, status, errorThrown) {
            if (status=='timeout') {
                console.log( 'request timed out.' );
            }
            else {
                console.log(jqXHR);
                console.log(errorThrown);
                alert(jqXHR.responseJSON.err);
            }
        },
        dataType: "json",
        timeout: 10000
    })
}

function renderForm(data){
    console.log(data)
    layArr = data.map(each => {
        return {
            namaLayanan : each.nama_layanan,
            deskripsi : each.deskripsi,
            harga : each.harga
        }
    })
    let text = ''
    layArr.forEach(element => {
        text += 
        `<input type="radio" name="pos" value="${element.namaLayanan}"> ${element.namaLayanan}<br>
        <p>deskripsi: ${element.deskripsi}</p>
        <p>harga: ${element.harga}</p><br>`
    });
    promptForm.append(text)
}
