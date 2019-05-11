$('#login').click((e) => {
    e.preventDefault()
    let username = $('#username').val()
    let password = $('#password').val()
    if(typeof username === 'undefined' || username === null || /^\s*$/.test(username)){
        alert('username harus diisi')
        return null
    }
    if(typeof password === 'undefined' || password === null || /^\s*$/.test(password)){
        alert('password harus diisi')
        return null
    }
    let data = { username, password }
    $.ajax({ 
        url: domain+"api/pengguna/login",
        type: "POST",
        data,
        success: function(data, status, jqXHR) {
            localStorage.setItem('sipToken',data.token)
            localStorage.setItem('sipJenisUser',data.jenisUser)
            window.location.href = '/monitor'
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
})