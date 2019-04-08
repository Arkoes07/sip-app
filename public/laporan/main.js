if(jenisUser !== 'admin' && jenisUser !== 'owner'){
    window.location.href = '/monitor'
}

let box = $('#box')
$('#cariBtn').click((e) => {
    e.preventDefault()
    const tgl = $('#tgl').val()
    loadData(tgl)
})

function loadData(tgl) {
    console.log(tgl)
    box.empty()
    $.ajax({ 
        url: "http://localhost:5000/api/mix/detailTransaksi/"+tgl,
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
    if(data.length === 0){
        alert('tidak ditemukan')
    }
    data.forEach(element => {
        let content = new Layanan(element)
        box.append(content.getElement())
    })
}
