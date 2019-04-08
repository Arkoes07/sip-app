if(jenisUser !== 'admin' && jenisUser !== 'operator'){
    window.location.href = '/monitor'
}

let box = $('#box')
loadData()

function loadData() {
    box.empty()
    $.ajax({ 
        url: "http://localhost:5000/api/transaksi/today",
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
        let content = new Layanan(element)
        box.append(content.getIndexElement())
    })
}

function deleteData(noTransaksi) {
    if (confirm("Yakin untuk mengahapus transaksi : "+noTransaksi+"?")) {
        $.ajax({ 
            url: "http://localhost:5000/api/transaksi/"+noTransaksi,
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

function ubahData(noTransaksi) {
    console.log(noTransaksi)
    if (confirm("Yakin untuk melanjutkan transaksi : "+noTransaksi+"?")) {
        $.ajax({ 
            url: "http://localhost:5000/api/transaksi/"+noTransaksi,
            type: "PUT",
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