var apikey = "AIzaSyBzPV7qe_5PM3kg1KfVf5atnNyQD0THl_M";

//the places that dont have opennow specified wont be displayed
//rankby can be prominence (ranking) or distance (obvious one)
//locationCoord = {lat, long}
//keyword = can be vegan or a street name
// icon pt restaurant aici https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png
function getRestaurantsJSON(locationLat,locationLong, keyword, opennow, rankby, callback){
    $.getJSON('https://maps.googleapis.com/maps/api/place/textsearch/json?type=restaurant&location=' + locationLat + ',' + locationLong + (keyword ? ("&keyword=" + keyword) : '') + (opennow ?  '&opennow' : '') + (rankby ? ("&rankby=" + rankby) : '') + '&key='+apikey, (res) => restaurantCallback(res, callback) );
}
restaurantsInfo = [];
function restaurantCallback(restData, callback){
    var data = restData.results;
    var name, formatted_address, place_id, rating, location;
    for (var i = 0; i < data.length; i++){
        //console.log(data[i]);
        name = data[i].name;
        formatted_address = data[i].formatted_address;
        lat = data[i].geometry.location.lat;
        lng = data[i].geometry.location.lng;
        place_id = data[i].place_id;
        rating = data[i].rating;
        restaurantsInfo.push({name, lat, lng, place_id, rating, formatted_address})
    }
    callback(restaurantsInfo);
}


//the places that dont have opennow specified wont be displayed
//rankby can be prominence (ranking) or distance (obvious one)
//locationCoord = {lat, long}
//if ratingSorted = true, you sort the elems by rating
//if you wanna checck if they're opened
//if result is null and you have openedNow = true, print message "No museums opened at the time. Try back tomorrow"
function getMuseumsJSON(locationLat, locationLong, openedNow, ratingSorted, callback) {
    $.getJSON('https://maps.googleapis.com/maps/api/place/textsearch/json?type=museum&location=' + locationLat + ',' + locationLong + (openedNow ?  '&opennow' : '') + '&key='+apikey, (result) =>museumCallback(ratingSorted, result, callback) );
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

function museumCallback(ratingSorted, restData, callback){
    var res = restData;
//    console.log(res)
    if (res.status == "ZERO_RESULTS"){
        return null;
    } else {
        data = res.results;
        museumInfo = [];
        var name, formatted_address, place_id, rating, location;
        for (var i = 0; i < data.length; i++){
            //console.log(data[i]);
            name = data[i].name;
            formatted_address = data[i].formatted_address;
            lat = data[i].geometry.location.lat;
            lng = data[i].geometry.location.lng;
            place_id = data[i].place_id;
            rating = data[i].rating;

            museumInfo.push({name, lat, lng, place_id, rating, formatted_address})
        }

        if (ratingSorted == true) {
            museumInfo.sort(compare)
        }
    }
    callback(museumInfo);
}

//the places that dont have opennow specified wont be displayed
//rankby can be prominence (ranking) or distance (obvious one)
//locationCoord = {lat, long}
//if ratingSorted = true, you sort the elems by rating
function getlodgingJSON(locationLat,locationLong,ratingSorted,callback) {
    $.getJSON('https://maps.googleapis.com/maps/api/place/textsearch/json?type=lodging&name=hotel&location=' + locationLat + ',' + locationLong + '&key='+apikey, (result) =>lodgingCallback(ratingSorted, result, callback) );
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

function lodgingCallback(ratingSorted, restData, callback){
    var data = restData.results;
    lodgingInfo = [];
    var name, formatted_address, place_id, rating, location;
    for (var i = 0; i < data.length; i++){
        //console.log(data[i]);
        name = data[i].name;
        formatted_address = data[i].formatted_address;
        lat = data[i].geometry.location.lat;
        lng = data[i].geometry.location.lng;
        place_id = data[i].place_id;
        rating = data[i].rating;

        lodgingInfo.push({name, lat, lng, place_id, rating, formatted_address})
    }

    if (ratingSorted == true) {
        lodgingInfo.sort(compare)
    }
    //console.log(lodgingInfo);
    callback(lodgingInfo);
}

//the places that dont have opennow specified wont be displayed
//rankby can be prominence (ranking) or distance (obvious one)
//locationCoord = {lat, long}
//keyword = can be vegan or a street name
// icon pt restaurant aici https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png
function getClubsJSON(locationLat,locationLong,openedNow, ratingSorted, callback){
    $.getJSON('https://maps.googleapis.com/maps/api/place/textsearch/json?type=night_club&location=' + locationLat + ',' + locationLong + (openedNow ?  '&opennow' : '') + '&key='+apikey, (result) => clubsCallback(ratingSorted, result, callback));
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


function clubsCallback(ratingSorted, clubsData, callback){
    var res = clubsData;
    // console.log(res.results)
    if (res.status == "ZERO_RESULTS"){
        return null;
    } else {
        data = res.results;
        clubsInfo = [];
        var name, formatted_address, place_id, rating, location;
        for (var i = 0; i < data.length; i++){
            name = data[i].name;
            formatted_address = data[i].formatted_address;
            lat = data[i].geometry.location.lat;
            lng = data[i].geometry.location.lng;
            place_id = data[i].place_id;
            rating = data[i].rating;

            clubsInfo.push({name, lat, lng, place_id, rating, formatted_address})
        }

        if (ratingSorted == true) {
            clubsInfo.sort(compare)
        }
        // console.log(clubsInfo);
        callback(clubsInfo);
    }
}