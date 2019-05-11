if(jenisUser !== 'admin' && jenisUser !== 'owner'){
    window.location.href = '/monitor'
}

$('#backBtn').click((e) => {
    e.preventDefault()
    if(confirm("anda yakin? data yang diisi belum disimpan.")){
        window.location.href = '/pos';
    }
})

$('#saveBtn').click((e) => {
    e.preventDefault()

    let data = {
        nama_pos : $('#judul').val(),
        deskripsi : $('#deskripsi').val(),
        durasi : $('#durasi').val()
    }

    $.ajax({ 
        url: domain+"api/pos",
        type: "POST",
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
                console.log(jqXHR);
                console.log(errorThrown);
                alert(jqXHR.responseJSON.err);
            }
        },
        dataType: "json",
        timeout: 10000
    })
})