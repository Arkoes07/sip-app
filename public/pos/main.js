let box = $('#box')
loadData()


// ------------------------------

function loadData() {
    box.empty()
    $.ajax({ 
        url: "http://localhost:5000/api/pos",
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
        const { nama_pos : judul, deskripsi, durasi } = element
        let content = new Pos(judul, deskripsi, durasi)
        box.append(content.getElement())
    })
}

function deleteData(namaPos) {
    if (confirm("Yakin untuk mengahapus Pos : "+namaPos+"?")) {
        $.ajax({ 
            url: "http://localhost:5000/api/pos",
            type: "DELETE",
            data: { nama_pos : namaPos},
            success: function(data, status, jqXHR) {
                loadData()
            },
            error: function(jqXHR, status, errorThrown) {
                if (status=='timeout') {
                    console.log( 'request timed out.' );
                }
                else {
                    console.log(jqXHR.responseJSON.err);
                }
            },
            dataType: "json",
            timeout: 10000
        })
    } 
}

function ubahData(namaPos) {
    localStorage.setItem('namaPos',namaPos)
    window.location.href = 'ubah.html';
}