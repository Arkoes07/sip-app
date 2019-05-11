let box = $('#box')
loadData()

let socket = io();
socket.on('connected', function(data) {
    console.log('socket ready')
    socket.emit('ready for data', {});
})
socket.on('update', function(data) {
    // console.log(data.message.payload)
    loadData()
})


function loadData() {
    console.log('loading....')
    box.empty()
    $.ajax({ 
        url: domain+"api/mix/detailTransaksi",
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
        box.append(content.getElement())
    })
}
