// [{"lat":44.441781286670064,"lng":26.025329161718787},{"lat":44.43736896913248,"lng":26.029105712011756},{"lat":44.43418208812947,"lng":26.041636992529334},{"lat":44.43868270167809,"lng":26.049442291259766},{"lat":44.4342411,"lng":26.05299679999996},{"lat":44.447215,"lng":26.047284999999988},{"lat":44.447968,"lng":26.073139500000025}]

pins =  JSON.parse(localStorage['pins']);
console.log(pins);

function getWeatherJSON(lat, lng, callback){
    $.getJSON('http://api.apixu.com/v1/forecast.json?key=0e7686e48230480abbf113252181404&q='+lat+','+lng+'&days=10', (res) => weatherCallback(res, callback));

}

function weatherCallback(weatherdata, callback){
    var apiDetails = weatherdata.forecast;
    var forecast = [];
    console.log(apiDetails)
    var weatherState,  date, avgTemp, maxTemp;

    for (var i = 0; i < 7; i++){
        date = apiDetails.forecastday[i].date;
        avgTemp = apiDetails.forecastday[i].day.avgtemp_c;
        maxTemp = apiDetails.forecastday[i].day.maxtemp_c;
        weatherState = apiDetails.forecastday[i].day.condition.text;



        forecast.push({date, avgTemp, maxTemp, weatherState })
    }

    callback(forecast);
}

function buildAgenda() {
    document.getElementById("agenda").innerHTML = "";
    localStorage['pins'] = JSON.stringify(pins);

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
    pin = pins.find((p) => p.place_id == place_id);
    getWeatherJSON(pin.lat, pin.lng, function(forecast) {
        console.log(forecast);
        document.getElementById("infoweather").innerHTML = "<h4>Weather forecast</h4>";

        forecast.map((f) => {
            document.getElementById("infoweather").innerHTML += "" +
            "<div class='forecastsquare'>" +
                `<div class='forecastdate'>${f.date}</div>` +
                `<div class='maxtemp'>${f.maxTemp}</div>` +
                `<div class='avgtemp'>${f.avgTemp}</div>` +
                `<div class='forecaststate'>${f.weatherState}</div>` +
            "</div>"
        });
    });

    document.getElementById("infotitle").innerHTML = "<h3>Information about " + pin.name+"</h3>";
}

function showMore(place_id) {

}

buildAgenda();