if(jenisUser !== 'admin' && jenisUser !== 'operator'){
    window.location.href = '/monitor'
}

loadLayanan()

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
        nama_layanan : $('#layanan').children("option:selected").val(),
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

function loadLayanan(){
    $.ajax({ 
        url: "http://localhost:5000/api/layanan",
        type: "GET",
        success: function(data, status, jqXHR) {
            renderLayanan(data)
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

function renderLayanan(data){
    data.forEach(element => {
        const text = `<option value="${element.nama_layanan}">${element.nama_layanan}</option>`
        $('#layanan').append(text)
    });
}