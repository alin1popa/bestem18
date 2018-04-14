//the places that dont have opennow specified wont be displayed
//rankby can be prominence (ranking) or distance (obvious one)
//locationCoord = {lat, long}
//keyword = can be vegan or a street name
// icon pt restaurant aici https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png
function getRestaurantsJSON(locationLat,locationLong, keyword, opennow, rankby, callback){
    $.getJSON('https://maps.googleapis.com/maps/api/place/textsearch/json?type=restaurant&location=' + locationLat + ',' + locationLong + (keyword ? ("&keyword=" + keyword) : '') + (opennow ?  '&opennow' : '') + (rankby ? ("&rankby=" + rankby) : '') + '&key=AIzaSyCZpdfSClvPFQEX-Q6O7xknzgVtC13s4GY', (res) => restaurantCallback(res, callback) );
}
restaurantsInfo = [];
function restaurantCallback(restData, callback){
    var data = restData.results;
    var name, formatted_address, place_id, rating, location;
    for (var i = 0; i < 20; i++){
        //console.log(data[i]);
        name = data[i].name;
        formatted_address = data[i].formatted_address;
        lat = data[i].geometry.location.lat;
        lng = data[i].geometry.location.lng;
        place_id = data[i].place_id;
        rating = data[i].rating;
        color = Math.floor(Math.random()*colors.length - 0.01);

        restaurantsInfo.push({name, lat, lng, place_id, rating, formatted_address, color})
    }
    console.log(restaurantsInfo);
    callback(restaurantsInfo);
}
