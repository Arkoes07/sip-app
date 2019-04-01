let btn = document.getElementById('menu-btn');
let menu = document.getElementById('menu-box');

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

