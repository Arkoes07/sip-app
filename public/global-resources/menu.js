let btn = document.getElementById('menu-btn');
let menu = document.getElementById('menu-box');

let jenisUser = localStorage.getItem('sipJenisUser')
let userToken = localStorage.getItem('sipToken')

decideMenu();

menu.style.display = "none";

function showMenu(){
    menu.style.display = "block";
}
function hideMenu(){
    menu.style.display = "none";
}

btn.addEventListener('click',(event) => {
    event.stopPropagation();
    if(menu.style.display == "block"){
        hideMenu();
    }else{
        showMenu();
    }
});

menu.addEventListener('click', (event) => {
    event.stopPropagation();
});

document.addEventListener('click',(event) => {
    hideMenu();
});

function decideMenu(){
    const menuBox = $('#menu-box')
    menuBox.empty()
    menuBox.append('<div class="logo"></div>')
    const monitorMenu = `<a href="../monitor/"><div class="menu-link">MONITOR</div></a>`
    const layananMenu = `<a href="../layanan/"><div class="menu-link">layanan</div></a>`
    const posMenu = `<a href="../pos/"><div class="menu-link">pos</div></a>`
    const pekerjaMenu = `<a href="../pekerja/"><div class="menu-link">pekerja</div></a>`
    const transaksiMenu = `<a href="../transaksi/"><div class="menu-link">transaksi</div></a>`
    const loginMenu = `<div class="log-link"><a href="../login"><button>MASUK</button></a></div>`
    const logoutMenu = `<div class="log-link"><a href="../logout"><button>KELUAR</button></a></div>`
    const userInfo = `<div class="user-info">${jenisUser}</div>`
    if(typeof jenisUser == 'undefined' || jenisUser === null || /^\s*$/.test(jenisUser)){
        menuBox.append(monitorMenu)
        menuBox.append(loginMenu)
    }
    if(jenisUser == 'operator'){
        menuBox.append(monitorMenu)
        menuBox.append(userInfo)
        menuBox.append(logoutMenu)
    }
    if(jenisUser == 'admin'){
        menuBox.append(monitorMenu)
        menuBox.append(transaksiMenu)
        menuBox.append(layananMenu)
        menuBox.append(posMenu)
        menuBox.append(pekerjaMenu)
        menuBox.append(userInfo)
        menuBox.append(logoutMenu)
    }
    if(jenisUser == 'owner'){
        menuBox.append(monitorMenu)
        menuBox.append(layananMenu)
        menuBox.append(posMenu)
        menuBox.append(pekerjaMenu)
        menuBox.append(userInfo)
        menuBox.append(logoutMenu)
    }
}

