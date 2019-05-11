if(jenisUser !== 'admin' && jenisUser !== 'owner'){
    window.location.href = '/monitor'
}


let box = $('#box')
loadData()

function loadData() {
    box.empty()
    $.ajax({ 
        url: domain+"api/mix/detailPekerja",
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
        const { id_pekerja : id, nama_pekerja : judul, tugas} = element
        let content = new Pekerja(id,judul,tugas)
        box.append(content.getElement())
    })
}

function deleteData(idPekerja) {
    if (confirm("Yakin untuk mengahapus Pekerja id : "+idPekerja+"?")) {
        $.ajax({ 
            url: domain+"api/pekerja/"+idPekerja,
            type: "DELETE",
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

function ubahData(idPekerja) {
    localStorage.setItem('idPekerja',idPekerja)
    window.location.href = 'ubah.html';
}