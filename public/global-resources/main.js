//confirm box modal
function confirmBox(msg,callback){
    $('#confirm-msg').html(msg);
    $('#confirmModal').css('display','flex');
    $('#tidak').click(()=>{
        closeConfirmBox(false,callback);
    })
    $('#yakin').click(()=>{
        $('#confirmModal').css('display','none');
        closeConfirmBox(true,callback);
    })
}
function closeConfirmBox(result,callback){
    $('#confirmModal').css('display','none');
    $('#yakin').off('click');
    $('#tidak').off('click');
    callback(result);
}

//search box modal
function searchBox(namaUser,jenisUser){
    let today = getTodayDate();
    $('#inpTanggal').val(today);
    $('#searchModal').css('display','flex');
    $('.close').click(()=>{
        closeSearchBox();
    });
    $('#searchFormBtn').click(()=>{
        if($('#inpTanggal').val() == ""){
            alert("tgl harus diisi");
        }else{
            let sidangQueryParam = {
                noPerkara : $('#inpNoPerkara').val(),
                tgl : $('#inpTanggal').val(),
                ruang : $('#inpRuang').val(),
                is_operator_flag: false,
                is_panitera_flag: false
            }
            if(jenisUser == "paniteraPengganti"){
                sidangQueryParam.panitera = namaUser;
                sidangQueryParam.is_panitera_flag = true;
            }
            if(jenisUser == "operator"){
                sidangQueryParam.is_operator_flag = true;
            }
            if(jenisUser == "admin"){
                sidangQueryParam.is_panitera_flag = true;
                sidangQueryParam.is_operator_flag = true;
            }
            $('#search-loading').removeAttr('hidden');
            tableAjaxCall(sidangQueryParam);
        }
    })
}

function announceBox(){
    $('#annContent').val("")
    $('#announceModal').css('display','flex');
    $('#kembaliAnn').click(()=>{
        closeAnnounceBox();
    });
    $('#umumAnn').click(()=>{
        let annContent = $('#annContent').val();
        console.log(annContent);

        pleaseSpeakForMe(annContent,() => {
            closeAnnounceBox();
        });
        
    });

}

function tableAjaxCall(parameter,layarTV){
    let url = "api-dev/sidang-harian";
    if(layarTV == true && typeof layarTV !== 'undefined'){
        url = "../../api-dev/sidang-harian";
    }
    $.ajax({ 
        url: url,
        data:parameter,
        success: function(data, status, jqXHR) {
            // do something with the data
            console.log("Hasil tableAjaxCall : "+JSON.stringify(data.msg));
            renderInfo(parameter.noPerkara,parameter.ruang,parameter.tgl);
            if(data.status == "gagal"){
                alert(data.msg);
            }
            closeSearchBox();
            jsonToTable("tbl1",data.content,parameter.is_operator_flag,parameter.is_panitera_flag,layarTV,parameter.ruang);
            if(data.path){
                let pollParameter = {
                    path : data.path,
                    is_operator_flag : parameter.is_operator_flag,
                    is_panitera_flag : parameter.is_panitera_flag
                };
                if(typeof data.filterParameter.nomorPerkara != 'undefined'){
                    pollParameter.nomorPerkara = data.filterParameter.nomorPerkara;
                }
                if(typeof data.filterParameter.panitera != 'undefined'){
                    pollParameter.panitera = data.filterParameter.panitera;
                }
                if(typeof data.filterParameter.ruangan != 'undefined'){
                    pollParameter.ruangan = data.filterParameter.ruangan;
                }
                console.log("pollParameter : "+JSON.stringify(pollParameter));
                poll(pollParameter,layarTV);
            }
        },
        error: function(jqXHR, status, errorThrown) {
            if (status=='timeout') {
                closeSearchBox();
                alert("timeout");
                console.log( 'request timed out.' );
            }
            else {
                closeSearchBox();
                alert(status);
                console.log(status);
            }
        },
        dataType: "json",
        timeout: 300000
    });
}

function poll(pollParameter,layarTV){
    // console.log(pollParameter);
    let url = "./api-dev/long-polling";
    if(layarTV == true && typeof layarTV !== 'undefined'){
        url = "../../api-dev/long-polling";
    }
    $.ajax({ 
        url: url,
        data: pollParameter,
        success: function(data, status, jqXHR) {
            jsonToTable("tbl1",data.content,pollParameter.is_operator_flag,pollParameter.is_panitera_flag,layarTV,pollParameter.ruang);
            poll(pollParameter,layarTV);
        },
        error: function(jqXHR, status, errorThrown) {
            if (status=='timeout') {
                console.log( 'request timed out.' );
                poll(pollParameter,layarTV);
            }
            else {
                console.log(status);
                setTimeout( poll(pollParameter,layarTV), 60000 );
            }
        },
        dataType: "json",
        timeout: 60000
    });
};

function ubahStatus(data,status){
    let ubahParameter = {
        idPerkara : data.idPerkara,
        tglSidang : data.tglSidang,
        jamSidang : data.jamSidang,
        ruangan : data.ruangan,
        status : status
    };
    console.log("ubahParameter : "+JSON.stringify(ubahParameter));
    $.ajax({ 
        url: "./api-dev/ubah-status",
        data: ubahParameter,
        success: function(data, status, jqXHR) {
            console.log("hasil ubah status : "+JSON.stringify(data.msg));
        },
        error: function(jqXHR, status, errorThrown) {
            if (status=='timeout') {
                console.log( 'request timed out.' );
            }
            else {
                console.log(status);
            }
        },
        dataType: "json",
        timeout: 60000
    });
}

// function umumkan(data,keterangan,layarTV = false){
//     let url = "./api-dev/tambah-umumkan";
//     if(layarTV == true && typeof layarTV !== 'undefined'){
//         url = "../../api-dev/tambah-umumkan";
//     }
//     let umumkanParameter = {
//         idPerkara : data.idPerkara,
//         tglSidang : data.tglSidang,
//         jamSidang : data.jamSidang,
//         ruangan : data.ruangan,
//         keterangan : keterangan
//     };
//     console.log("umumkan parameter : "+JSON.stringify(umumkanParameter));
//     $.ajax({ 
//         url: url,
//         data: umumkanParameter,
//         success: function(data, status, jqXHR) {
//             console.log("hasil ubah umumkan : "+JSON.stringify(data.msg));
//         },
//         error: function(jqXHR, status, errorThrown) {
//             if (status=='timeout') {
//                 console.log( 'request timed out.' );
//             }
//             else {
//                 console.log(status);
//             }
//         },
//         dataType: "json",
//         timeout: 60000
//     });
// }

function closeSearchBox(){
    $('#searchModal').css('display','none');
    $('#searchFormBtn').off('click');
    $('.close').off('click');
    $('#search-loading').attr('hidden',true);
}

function closeAnnounceBox(){
    $('#announceModal').css('display','none');
    $('#kembaliAnn').off('click');
    $('#umumAnn').off('click');
}



function lanjutStopwatch(jsonDataInput){
    // console.log(jsonDataInput);
    //ambil waktu dari json file menggunakan ajax
    let lanjutParameter = {
        idPerkara : jsonDataInput.idPerkara,
        tglSidang : jsonDataInput.tglSidang,
        jamSidang : jsonDataInput.jamSidang,
        ruangan : jsonDataInput.ruangan
    };
    $.ajax({ 
        url: "./api-dev/ambil-waktu-mulai",
        data: lanjutParameter,
        success: function(data, status, jqXHR) {
            // console.log(data.telahBerlangsung);
            let time = toTimeString(data.telahBerlangsung);
            renderStopwatch(jsonDataInput,time);
        },
        error: function(jqXHR, status, errorThrown) {
            if (status=='timeout') {
                console.log( 'request timed out.' );
            }
            else {
                console.log(status);
            }
        },
        dataType: "json",
        timeout: 60000
    });
    
}


let t;

//running box modal
function renderStopwatch(jsonDataInput,timeArr = [0,0,0]){
    stopwatchContent = `${timeArr[0]}:${timeArr[1]}:${timeArr[2]}`;
    $('#stopwatch').html(stopwatchContent);
    // console.log(jsonDataInput);
    $('#runningModal').css('display','flex');
    let stopwatch = timeArr;
    add(stopwatch);
    $('#selesai').click(()=>{
        let timeTaken = $('#stopwatch').html();
        $('#runningModal').css('display','none');
        let msg = "waktu akan tercatat di sistem";
        confirmBox(msg,(result)=>{
            if(!result){
                $('#runningModal').css('display','flex');
            }else{
                //ajax call untuk mengubah status menjadi selesai
                ubahStatus(jsonDataInput,"selesai");
                console.log("time taken : "+timeTaken);
                clearTimeout(t);
                $('#selesai').off('click');
            }
        })
    })
}

function add(stopwatch){
    let sw = stopwatch;
    sw[2]++;
    if (sw[2] >= 60) {
        sw[2] = 0;
        sw[1]++;
        if (sw[1] >= 60) {
            sw[1] = 0;
            sw[0]++;
        }
    }
    let h = sw[0];
    let m = sw[1];
    let s = sw[2];
    h <= 9 ? h = `0${h}` : h = h;
    m <= 9 ? m = `0${m}` : m = m;
    s <= 9 ? s = `0${s}` : s = s;
    stopwatchContent = `${h}:${m}:${s}`;
    $('#stopwatch').html(stopwatchContent);
    t = setTimeout(add,1000,sw);
}



function renderInfo(noPerkara,ruang,tanggal){
    tanggalText = toDateString(tanggal);
    if(noPerkara == ""){
        noPerkara = "Seluruhnya";
    }
    if(ruang == ""){
        ruang = "Seluruhnya";
    }
    let result = `Menampilkan Informasi untuk nomor perkara : ${noPerkara}, ruang : ${ruang}, dan tanggal : ${tanggalText}`;
    $('#info-text').html(result);
}


function renderTime(layarTV = false){
    let now = new Date();
    let days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    let months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    let day = days[now.getDay()];
    let month = months[now.getMonth()];
    let year = now.getFullYear();
    let date = now.getDate();
    let h = now.getHours();
    h <= 9 ? h = `0${h}` : h = h;
    let m = now.getMinutes();
    m <= 9 ? m = `0${m}` : m = m;
    let s = now.getSeconds();
    s <= 9 ? s = `0${s}` : s = s;
    let current = `${day}, ${date} ${month} ${year}. ${h}:${m}:${s}`;
    if(!layarTV){
        $('#dat').html(current);
        setTimeout(renderTime,1000);
    }else{
        $('#dat').html(current2);
        setTimeout(renderTime,1000,true);
    }
    
}

function getTodayDate(){
    let now = new Date();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();
    let date = now.getDate();
    month <= 9 ? month = `0${month}` : month = month;
    date <= 9 ? date = `0${date}` : date = date;
    return `${year}-${month}-${date}`;
}

function toTimeString(second){
    // console.log(second);
    let s = second%60;
    let minutes = Math.floor(second/60);
    let m = minutes%60;
    let h = Math.floor(minutes/60);
    let timeArr = [h,m,s];
    return timeArr;
}

function toDateString(dateInput){
    let now = new Date(dateInput);
    let days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    let months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    let day = days[now.getDay()];
    let month = months[now.getMonth()];
    let year = now.getFullYear();
    let date = now.getDate();
    let dateString = `${day}, ${date} ${month} ${year}`;
    return dateString;
}

// function tampilPopupLayarTv(data){
//     // console.log("data yang akan diumumkan : "+JSON.stringify(data));
//     let text = `KEDAPA PARA PIHAK BERPERKARA NOMOR ${data.nomorPerkara} UNTUK SEGERA MASUK KE RUANG SIDANG ${data.ruangan} KARENA SIDANG AKAN SEGERA DIMULAI`;
//     // console.log(text);

//     $('#attention').css('display','flex');
//     $("#popuptext").html(text);

//     popUpClassToggle(data);
// }


// let popUpTimer;
// let popUpTimerCount = 0;

// function popUpClassToggle(data){
//     $('#modalCont').toggleClass('content-shadow-big');
//     if(popUpTimerCount == 10){
//         $('#attention').css('display','none');
//         clearTimeout(popUpTimer);
//         popUpTimerCount = 0;
//         umumkan(data,"hapus",true);
//     }else{
//         popUpTimerCount++;
//         popUpTimer = setTimeout(popUpClassToggle,500,data);
//     }
// }
