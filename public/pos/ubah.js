if(jenisUser !== 'admin' && jenisUser !== 'owner'){
    window.location.href = '/monitor'
}

const namaPos = localStorage.getItem('namaPos')

if(typeof namaPos == 'undefined' || namaPos == null){
    localStorage.removeItem('namaPos')
    window.location.href = '/pos'
}else{
    loadData()
}

$('#backBtn').click((e) => {
    e.preventDefault()
    if(confirm("anda yakin? data yang diisi belum disimpan.")){
        localStorage.removeItem('namaPos')
        window.location.href = '/pos';
    }
})

$('#saveBtn').click((e) => {
    e.preventDefault()
    let data = {
        nama_pos : $('#judul').val(),
        deskripsi : $('#deskripsi').val(),
        durasi : $('#durasi').val(),
        old_nama_pos : namaPos
    }
    $.ajax({ 
        url: "http://localhost:5000/api/pos",
        type: "PUT",
        data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${userToken}`);
        },
        success: function(data, status, jqXHR) {
            window.location.href = '/pos';
        },
        error: function(jqXHR, status, errorThrown) {
            if (status=='timeout') {
                console.log( 'request timed out.' );
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
})

function loadData() {
    $.ajax({ 
        url: "http://localhost:5000/api/pos",
        type: "GET",
        data: {nama_pos : namaPos},
        success: function(data, status, jqXHR) {
            renderData(data)
        },
        error: function(jqXHR, status, errorThrown) {
            if (status=='timeout' ) {
                console.log( 'request timed out.' );
            }
            else {
                alert(jqXHR.responseJSON.err);
            }
        },
        dataType: "json",
        timeout: 10000
    })
}

function renderData(data){
    $('#judul').val(data[0].nama_pos),
    $('#deskripsi').val(data[0].deskripsi),
    $('#durasi').val(data[0].durasi)
}

