if(jenisUser !== 'admin' && jenisUser !== 'owner'){
    window.location.href = '/monitor'
}

let box = $('#box')
loadData()

function loadData() {
    box.empty()
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

function renderData(data) {
    data.forEach(element => {
        const { nama_layanan : judul, deskripsi, harga, pos } = element
        let content = new Layanan(judul, deskripsi, harga, pos)
        box.append(content.getElement())
    })
}

function deleteData(namaLayanan) {
    if (confirm("Yakin untuk mengahapus Layanan : "+namaLayanan+"?")) {
        $.ajax({ 
            url: "http://localhost:5000/api/layanan",
            type: "DELETE",
            data: { nama_layanan : namaLayanan },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${userToken}`);
            },
            success: function(data, status, jqXHR) {
                loadData()
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
    } 
}

function ubahData(namaLayanan) {
    console.log(namaLayanan)
    localStorage.setItem('namaLayanan',namaLayanan)
    window.location.href = 'ubah.html';
}