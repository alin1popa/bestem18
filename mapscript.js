

var map, infoWindow;
var pins = [];

var mapStyle4 = [{"featureType":"water","stylers":[{"color":"#19a0d8"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"weight":6}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#e85113"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efe9e4"},{"lightness":-40}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#efe9e4"},{"lightness":-20}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"lightness":-100}]},{"featureType":"road.highway","elementType":"labels.icon"},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","stylers":[{"lightness":20},{"color":"#efe9e4"}]},{"featureType":"landscape.man_made","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":-100}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"hue":"#11ff00"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"hue":"#4cff00"},{"saturation":58}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#f0e4d3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#efe9e4"},{"lightness":-25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#efe9e4"},{"lightness":-10}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"simplified"}]}];
// Add Marker Function
function addMarker(props){
    var marker = new google.maps.Marker({
        position:props.coords,
        map:map,
        //icon:props.iconImage
    });

    // Check for customicon
    if(props.iconImage){
        // Set icon image
        marker.setIcon(props.iconImage);
    }

    // Check content
    if(props.content){
        var infoWindow = new google.maps.InfoWindow({
            content:props.content
        });

        marker.addListener('click', function(){
            infoWindow.open(map, marker);
        });
    }
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}


function initAutocomplete() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 13,
        mapTypeId: 'roadmap',
        styles: mapStyle4
    });
    infoWindow = new google.maps.InfoWindow;

    // Listen for click on map
    google.maps.event.addListener(map, 'click', function(event){
        // Add marker
        addMarker({coords:event.latLng});
    });
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('You\'re here.');
            infoWindow.open(map);
            map.setCenter(pos);

            setupGeolocation(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }


    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

function getCloseHotels(position) {
    getlodgingJSON(position.lat, position.lng, false, showHotels);
}

function getCloseMuseums(position) {
    getMuseumsJSON(position.lat, position.lng, false, false, showMuseums);
}

function getCloseRestaurants(position) {
    getRestaurantsJSON(position.lat, position.lng, '', '', 'distance', showRestaurants);
}

function getCloseClubs(position) {
    getClubsJSON(position.lat, position.lng, false, false, showClubs);
}

colors = ["#037FE6", "#1AA2E6", "#366AE6", "#5998E6", "#0C2554", "#0C25B0", "#040B36", "#042536"];

rec_hotels = [];
rec_museums = [];
rec_restaurants = [];
rec_clubs = [];

hotel_page = 0;
museum_page = 0;
restaurant_page = 0;
club_page = 0;
nritems = 0;

hotel_offset = 0;
museum_offset = 0;
restaurant_offset = 0;
club_offset = 0;

function clickedRestaurant(id) {
    var place = rec_restaurants.find((r) => r.place_id == id);
    addMarker({coords:{lat: place.lat, lng: place.lng}});
}

function clickedHotel(id) {
    var place = rec_hotels.find((r) => r.place_id == id);
    addMarker({coords:{lat: place.lat, lng: place.lng}});
}

function clickedMuseum(id) {
    var place = rec_museums.find((r) => r.place_id == id);
    addMarker({coords:{lat: place.lat, lng: place.lng}});
}

function clickedClub(id) {
    var place = rec_clubs.find((r) => r.place_id == id);
    addMarker({coords:{lat: place.lat, lng: place.lng}});
}

function setupGeolocation(position) {
    getCloseHotels(position);
    getCloseMuseums(position);
    getCloseRestaurants(position);
    getCloseClubs(position);
}

function showRestaurants(items) {
    rec_restaurants = items;

    var widthString = window.getComputedStyle(document.getElementById("recommend-hotels")).width.toString();
    nritems = Math.floor((widthString.substring(0, widthString.length - 2) - 90) / 170);
    if (items.length < nritems) nritems = items.length;

    if (items.length > nritems) document.getElementById("recommend-restaurants").innerHTML = '<button type="button" class="recommend-left" onclick="restaurant_page--; showRestaurants(rec_restaurants);"><i class="fa fa-caret-left"></i></button>';

    for (var i = 0; i < nritems; i++) {
        restaurant = items[Math.abs((restaurant_offset + i+restaurant_page*nritems)%items.length)];
        document.getElementById("recommend-restaurants").innerHTML +=
            '<a href="#" onclick="clickedRestaurant(\''+restaurant.place_id+'\')"><div class="recommend-square"><span class="recname">' +
            (restaurant.name.length > 33 ? restaurant.name.substring(0, 33) + '...' : restaurant.name) +
            '</span><span class="recrating">Rating: ' + restaurant.rating +'/5</span></div></a>';
    };

    if (items.length > nritems) document.getElementById("recommend-restaurants").innerHTML += '<button type="button" class="recommend-right" onclick="restaurant_page++; showRestaurants(rec_restaurants);"><i class="fa fa-caret-right"></i></button>';
}

function showMuseums(items) {
    rec_museums = items;

    var widthString = window.getComputedStyle(document.getElementById("recommend-hotels")).width.toString();
    nritems = Math.floor((widthString.substring(0, widthString.length - 2) - 90) / 170);
    if (items.length < nritems) nritems = items.length;

    if (items.length > nritems) document.getElementById("recommend-museums").innerHTML = '<button type="button" class="recommend-left" onclick="museum_page--; showMuseums(rec_museums);"><i class="fa fa-caret-left"></i></button>';

    for (var i = 0; i < nritems; i++) {
        museum = items[Math.abs((museum_offset + i+museum_page*nritems)%items.length)];
        document.getElementById("recommend-museums").innerHTML +=
            '<a href="#" onclick="clickedMuseum(\''+museum.place_id+'\')"><div class="recommend-square"><span class="recname">' +
            (museum.name.length > 33 ? museum.name.substring(0, 33) + '...' : museum.name) +
            '</span><span class="recrating">Rating: ' + museum.rating +'/5</span></div></a>';
    };

    if (items.length > nritems) document.getElementById("recommend-museums").innerHTML += '<button type="button" class="recommend-right" onclick="museum_page++; showMuseums(rec_museums);"><i class="fa fa-caret-right"></i></button>';
}

function showHotels(items) {
    rec_hotels = items;

    var widthString = window.getComputedStyle(document.getElementById("recommend-hotels")).width.toString();
    nritems = Math.floor((widthString.substring(0, widthString.length - 2) - 90) / 170);
    if (items.length < nritems) nritems = items.length;

    if (items.length > nritems) document.getElementById("recommend-hotels").innerHTML = '<button type="button" class="recommend-left" onclick="hotel_page--; showHotels(rec_hotels);"><i class="fa fa-caret-left"></i></button>';

    for (var i = 0; i < nritems; i++) {
        hotel = items[Math.abs((hotel_offset + i+hotel_page*nritems)%items.length)];
        document.getElementById("recommend-hotels").innerHTML +=
            '<a href="#" onclick="clickedHotel(\''+hotel.place_id+'\')"><div class="recommend-square"><span class="recname">' +
            (hotel.name.length > 33 ? hotel.name.substring(0, 33) + '...' : hotel.name) +
            '</span><span class="recrating">Rating: ' + hotel.rating +'/5</span></div></a>';
    };

    if (items.length > nritems) document.getElementById("recommend-hotels").innerHTML += '<button type="button" class="recommend-right" onclick="hotel_page++; showHotels(rec_hotels);"><i class="fa fa-caret-right"></i></button>';
}

function showClubs(items) {
    rec_clubs = items;

    var widthString = window.getComputedStyle(document.getElementById("recommend-hotels")).width.toString();
    nritems = Math.floor((widthString.substring(0, widthString.length - 2) - 90) / 170);
    if (items.length < nritems) nritems = items.length;

    if (items.length > nritems) document.getElementById("recommend-clubs").innerHTML = '<button type="button" class="recommend-left" onclick="club_page--; showClubs(rec_clubs);"><i class="fa fa-caret-left"></i></button>';

    for (var i = 0; i < nritems; i++) {
        club = items[Math.abs((club_offset + i+club_page*nritems)%items.length)];
        document.getElementById("recommend-clubs").innerHTML +=
            '<a href="#" onclick="clickedClub(\''+club.place_id+'\')"><div class="recommend-square"><span class="recname">' +
            (club.name.length > 33 ? club.name.substring(0, 33) + '...' : club.name) +
            '</span><span class="recrating">Rating: ' + club.rating +'/5</span></div></a>';
    };

    if (items.length > nritems) document.getElementById("recommend-clubs").innerHTML += '<button type="button" class="recommend-right" onclick="club_page++; showClubs(rec_clubs);"><i class="fa fa-caret-right"></i></button>';
}


window.addEventListener('resize', function(){
    var widthString = window.getComputedStyle(document.getElementById("recommend-hotels")).width.toString();
    nritems = Math.floor((widthString.substring(0, widthString.length - 2) - 90) / 170);
    restaurant_offset += nritems * restaurant_page;
    museum_offset += nritems * museum_page;
    club_offset += nritems * club_page;
    hotel_offset += nritems * hotel_page;

    restaurant_page = 0;
    museum_page = 0;
    club_page = 0;
    hotel_page = 0;

    showRestaurants(rec_restaurants);
    showClubs(rec_clubs);
    showHotels(rec_hotels);
    showMuseums(rec_museums);
}, true);

$(document).ready(function(){
    $("#recommend-restaurants").hover(
        function() {
            $("#tl-overlay").css("opacity", "0");
        },
        function() {
            $("#tl-overlay").css("opacity", "0.75");
        }
    );

    $("#recommend-hotels").hover(
        function() {
            $("#tr-overlay").css("opacity", "0");
        },
        function() {
            $("#tr-overlay").css("opacity", "0.75");
        }
    );

    $("#recommend-museums").hover(
        function() {
            $("#bl-overlay").css("opacity", "0");
        },
        function() {
            $("#bl-overlay").css("opacity", "0.75");
        }
    );

    $("#recommend-clubs").hover(
        function() {
            $("#br-overlay").css("opacity", "0");
        },
        function() {
            $("#br-overlay").css("opacity", "0.75");
        }
    );
});
