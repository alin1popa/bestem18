// [{"lat":44.441781286670064,"lng":26.025329161718787},{"lat":44.43736896913248,"lng":26.029105712011756},{"lat":44.43418208812947,"lng":26.041636992529334},{"lat":44.43868270167809,"lng":26.049442291259766},{"lat":44.4342411,"lng":26.05299679999996},{"lat":44.447215,"lng":26.047284999999988},{"lat":44.447968,"lng":26.073139500000025}]

pins =  JSON.parse(localStorage['pins']);
console.log(pins);

function buildAgenda() {
    document.getElementById("agenda").innerHTML = "";

    pins.map((pin) => {
        document.getElementById("agenda").innerHTML +=
        '<div class="row agenda-row">\
            <span class="agenda-icons">\
                <a href="#" class="agenda-icon" onclick="showInfo(\''+pin.place_id+'\')"><i class="fa fa-info"></i></a>\
                <a href="#" class="agenda-icon" onclick="showMore(\''+pin.place_id+'\')"><i class="fa fa-plus-circle"></i></a>\
                <a href="#" class="agenda-icon" onclick="showDelete(\''+pin.place_id+'\')"><i class="fa fa-times-circle"></i></a>\
            </span>\
            <span class="agenda-name">'+pin.name+'</span>\
        </div>'
    });
}

function showDelete(place_id) {
    pins = pins.filter((p) => p.place_id !== place_id);
    localStorage['pins'] = JSON.stringify(pins);
    buildAgenda();
}

function showInfo(place_id) {
    
}

function showMore(place_id) {

}

buildAgenda();