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

//the places that dont have opennow specified wont be displayed
//rankby can be prominence (ranking) or distance (obvious one)
//locationCoord = {lat, long}
//if ratingSorted = true, you sort the elems by rating
//if you wanna checck if they're opened
//if result is null and you have openedNow = true, print message "No clubs opened at the time. Try back later"
function getInfoOfPlaceJSON(place, atlocationLat, atlocationLong, callback) {
    $.getJSON('https://maps.googleapis.com/maps/api/place/textsearch/json?type=' + place + '&location=' + atlocationLat + "," + atlocationLong + '&key=AIzaSyCZpdfSClvPFQEX-Q6O7xknzgVtC13s4GY', (res) => placeInfoCallback(res, callback) );
}

function compare(a, b) {
    var fstElem = a.rating;
    var sndElem = b.rating;

    comp = 0;
    if (fstElem < sndElem) {
        comp = 1;
    } else if (fstElem > sndElem) {
        comp = -1;
    }

    return comp;
}

function placeInfoCallback(placeData, callback){
    var res = placeData;
    //console.log(res)
    var openedStuff = []
    if (res.status == "ZERO_RESULTS"){
        return null;
    } else {
        data = res.results;
        // console.log(data.length)
        placeInfo = [];
        var name, formatted_address, place_id, rating, location, openedNow;
        for (var i = 0; i < data.length; i++){
            //console.log(data[i]);
            name = data[i].name;
            formatted_address = data[i].formatted_address;
            latCoord = data[i].geometry.location.lat;
            longCoord = data[i].geometry.location.lng;
            place_id = data[i].place_id;
            rating = data[i].rating;

            openingSch =  data[i].opening_hours;
            if (typeof openingSch == 'undefined'){
                openedNow = 'unknown'
            } else {
                openedNow = data[i].opening_hours.open_now;
            }
            placeInfo.push({name, latCoord, longCoord, place_id, rating, formatted_address, openedNow})
        }
    }

    console.log(placeInfo);
    callback(placeInfo);
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
    document.getElementById("similar").innerHTML = "";
    getWeatherJSON(pin.lat, pin.lng, function(forecast) {
        console.log(forecast);
        document.getElementById("infoweather").innerHTML = "<h4 class='infosectiontitle'>Weather forecast</h4>";

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

    document.getElementById("infolocation").innerHTML = "<h4 class='infosectiontitle'>Location details</h4>" +
            `<p class='locp'>Latitude: ${pin.lat}</p>` +
            `<p class='locp'>Longitude: ${pin.lng}</p>`;
}

function showMore(place_id) {
    pin = pins.find((p) => p.place_id == place_id);

    document.getElementById("infotitle").innerHTML = "<h3>Discover places near " + pin.name+"</h3>";
    document.getElementById("infoweather").innerHTML = "";
    document.getElementById("infolocation").innerHTML = "";
    document.getElementById("similar").innerHTML = `
        <select id="stype" class="form-control sselect">
					<option value="Select type" selected disabled>Select type</option>
					<option value="airport">Airport/option>
					<option value="amusement_park">Amusement park</option>
					<option value="art_gallery">Art gallery</option>
					<option value="atm">ATM</option>
					<option value="bank">Bank</option>
					<option value="bar">Bar</option>
					<option value="bus_station">Bus station</option>
					<option value="car_wash">Car wash</option>
					<option value="church">Church</option>
					<option value="embassy">Embassy</option>
					<option value="fire_station">Fire station</option>
					<option value="gas_station">Gas station</option>
					<option value="gym">Gym</option>
					<option value="hospital">Hospital</option>
					<option value="library">Library</option>
					<option value="locksmith">Locksmith</option>
					<option value="lodging">Lodging</option>
					<option value="museum">Museum</option>
					<option value="night_club">Night club</option>
					<option value="park">Park</option>
					<option value="pharmacy">Pharmacy</option>
					<option value="police">Police</option>
					<option value="post_office">Post office</option>
					<option value="restaurant">Restaurant</option>
					<option value="school">School</option>
					<option value="shopping_mall">Shoppinng mall</option>
					<option value="spa">SPA</option>
					<option value="subway_station">Subway station</option>
					<option value="supermarket">Supermarker</option>
					<option value="train_station">Train station</option>
				</select>
            <button type="button" class="btn btn-primary" onclick="getPlaces(${pin.lat}, ${pin.lng})">Discover</button>
            <div id="simcontainer"></div>
    `;
}

function getPlaces(lat, lng) {
    document.getElementById("simcontainer").innerHTML = "";
    getInfoOfPlaceJSON(document.getElementById('stype').value, lat, lng, function(data) {
        data.map((item) => {
            document.getElementById("simcontainer").innerHTML +=
            `<a href="#" onclick="clickedsmth('${item.place_id}', ${item.lat}, ${item.lng}, '${item.name}')"><div class="recommend-square similarsquare"><span class="recname">
            ${(item.name.length > 33 ? item.name.substring(0, 33) + '...' : item.name)}
            </span><span class="recrating">Rating: ${item.rating}/5</span></div></a>`;

    });
    });
}

function clickedsmth(place_id, lat, lng, name) {
    pins.push({
        lat: lat,
        lng: lng,
        name: name,
        place_id: place_id
    });
    localStorage['pins'] = JSON.stringify(pins);
    buildAgenda();
}

buildAgenda();