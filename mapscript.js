

var map, infoWindow;
var pins = [];

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
        mapTypeId: 'roadmap'
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

function getCloseHotels() {
    return [{"lat":44.430715352415525,"lng":26.05184555053711,"name":"hqqbgew"},{"lat":44.44137909691852,"lng":26.097164154052734,"name":"poamrzb"},{"lat":44.42752810855755,"lng":26.087207794189453,"name":"srqsajvxe"},{"lat":44.42090789289679,"lng":26.031246185302734,"name":"ghamoq"},{"lat":44.44662219614843,"lng":26.001983214453162,"name":"mfkqpbvad"},{"lat":44.46573680410561,"lng":26.03271060092777,"name":"ekofrhcb"},{"lat":44.45581269247562,"lng":26.025844145849646,"name":"liuywbagxs"},{"lat":44.46206140389331,"lng":26.058288146093787,"name":"appyaayn"},{"lat":44.45078873368656,"lng":26.0424952994141,"name":"rhsn"},{"lat":44.43681740601164,"lng":26.006618071630896,"name":"vgsedan"},{"lat":44.422229736448095,"lng":25.990481902197303,"name":"vgisxtvj"},{"lat":44.414627995422435,"lng":26.01623110874027,"name":"hvorjitrbx"},{"lat":44.41266609537236,"lng":26.048846770361365,"name":"wiaqtigr"},{"lat":44.40297824911097,"lng":26.06566958530277,"name":"mhsncea"},{"lat":44.40346881153706,"lng":26.031852294043006,"name":"kmvzhjqhdj"},{"lat":44.41070412950483,"lng":26.09588198764652,"name":"bbryeys"},{"lat":44.41867420641035,"lng":26.071849394873084,"name":"xygioy"},{"lat":44.40604419678582,"lng":26.08592562778324,"name":"sqmsiqjj"},{"lat":44.42639801355065,"lng":26.109443236425818,"name":"nzjkfyqdk"},{"lat":44.43914619266125,"lng":26.116996337011756,"name":"wkzslrxzl"},{"lat":44.46451169641235,"lng":26.108069945410193,"name":"ihplumprm"},{"lat":44.4703919788565,"lng":26.100001860693396,"name":"wxgavylxs"},{"lat":44.45314372899653,"lng":26.084632873535156,"name":"azyhaseb"},{"lat":44.45017602621822,"lng":26.069102812841834,"name":"tzzjckhg"},{"lat":44.444293707483226,"lng":26.06172137363285,"name":"uprjhhvfi"},{"lat":44.443313263435776,"lng":26.02773242099613,"name":"vpyvg"},{"lat":44.43387564810446,"lng":26.030307341650428,"name":"gqijlhnss"},{"lat":44.42811427655959,"lng":26.019835997656287,"name":"aqrzomyc"},{"lat":44.423823524552255,"lng":26.007819701269568,"name":"lxvyegmuh"},{"lat":44.405676291549064,"lng":26.001983214453162,"name":"vewgnakyi"}];
}

function getCloseMuseums() {
    return [{"lat":44.430715352415525,"lng":26.05184555053711,"name":"hqqbgew"},{"lat":44.44137909691852,"lng":26.097164154052734,"name":"poamrzb"},{"lat":44.42752810855755,"lng":26.087207794189453,"name":"srqsajvxe"},{"lat":44.42090789289679,"lng":26.031246185302734,"name":"ghamoq"},{"lat":44.44662219614843,"lng":26.001983214453162,"name":"mfkqpbvad"},{"lat":44.46573680410561,"lng":26.03271060092777,"name":"ekofrhcb"},{"lat":44.45581269247562,"lng":26.025844145849646,"name":"liuywbagxs"},{"lat":44.46206140389331,"lng":26.058288146093787,"name":"appyaayn"},{"lat":44.45078873368656,"lng":26.0424952994141,"name":"rhsn"},{"lat":44.43681740601164,"lng":26.006618071630896,"name":"vgsedan"},{"lat":44.422229736448095,"lng":25.990481902197303,"name":"vgisxtvj"},{"lat":44.414627995422435,"lng":26.01623110874027,"name":"hvorjitrbx"},{"lat":44.41266609537236,"lng":26.048846770361365,"name":"wiaqtigr"},{"lat":44.40297824911097,"lng":26.06566958530277,"name":"mhsncea"},{"lat":44.40346881153706,"lng":26.031852294043006,"name":"kmvzhjqhdj"},{"lat":44.41070412950483,"lng":26.09588198764652,"name":"bbryeys"},{"lat":44.41867420641035,"lng":26.071849394873084,"name":"xygioy"},{"lat":44.40604419678582,"lng":26.08592562778324,"name":"sqmsiqjj"},{"lat":44.42639801355065,"lng":26.109443236425818,"name":"nzjkfyqdk"},{"lat":44.43914619266125,"lng":26.116996337011756,"name":"wkzslrxzl"},{"lat":44.46451169641235,"lng":26.108069945410193,"name":"ihplumprm"},{"lat":44.4703919788565,"lng":26.100001860693396,"name":"wxgavylxs"},{"lat":44.45314372899653,"lng":26.084632873535156,"name":"azyhaseb"},{"lat":44.45017602621822,"lng":26.069102812841834,"name":"tzzjckhg"},{"lat":44.444293707483226,"lng":26.06172137363285,"name":"uprjhhvfi"},{"lat":44.443313263435776,"lng":26.02773242099613,"name":"vpyvg"},{"lat":44.43387564810446,"lng":26.030307341650428,"name":"gqijlhnss"},{"lat":44.42811427655959,"lng":26.019835997656287,"name":"aqrzomyc"},{"lat":44.423823524552255,"lng":26.007819701269568,"name":"lxvyegmuh"},{"lat":44.405676291549064,"lng":26.001983214453162,"name":"vewgnakyi"}];
}

function getCloseRestaurants() {
    return [{"lat":44.430715352415525,"lng":26.05184555053711,"name":"hqqbgew"},{"lat":44.44137909691852,"lng":26.097164154052734,"name":"poamrzb"},{"lat":44.42752810855755,"lng":26.087207794189453,"name":"srqsajvxe"},{"lat":44.42090789289679,"lng":26.031246185302734,"name":"ghamoq"},{"lat":44.44662219614843,"lng":26.001983214453162,"name":"mfkqpbvad"},{"lat":44.46573680410561,"lng":26.03271060092777,"name":"ekofrhcb"},{"lat":44.45581269247562,"lng":26.025844145849646,"name":"liuywbagxs"},{"lat":44.46206140389331,"lng":26.058288146093787,"name":"appyaayn"},{"lat":44.45078873368656,"lng":26.0424952994141,"name":"rhsn"},{"lat":44.43681740601164,"lng":26.006618071630896,"name":"vgsedan"},{"lat":44.422229736448095,"lng":25.990481902197303,"name":"vgisxtvj"},{"lat":44.414627995422435,"lng":26.01623110874027,"name":"hvorjitrbx"},{"lat":44.41266609537236,"lng":26.048846770361365,"name":"wiaqtigr"},{"lat":44.40297824911097,"lng":26.06566958530277,"name":"mhsncea"},{"lat":44.40346881153706,"lng":26.031852294043006,"name":"kmvzhjqhdj"},{"lat":44.41070412950483,"lng":26.09588198764652,"name":"bbryeys"},{"lat":44.41867420641035,"lng":26.071849394873084,"name":"xygioy"},{"lat":44.40604419678582,"lng":26.08592562778324,"name":"sqmsiqjj"},{"lat":44.42639801355065,"lng":26.109443236425818,"name":"nzjkfyqdk"},{"lat":44.43914619266125,"lng":26.116996337011756,"name":"wkzslrxzl"},{"lat":44.46451169641235,"lng":26.108069945410193,"name":"ihplumprm"},{"lat":44.4703919788565,"lng":26.100001860693396,"name":"wxgavylxs"},{"lat":44.45314372899653,"lng":26.084632873535156,"name":"azyhaseb"},{"lat":44.45017602621822,"lng":26.069102812841834,"name":"tzzjckhg"},{"lat":44.444293707483226,"lng":26.06172137363285,"name":"uprjhhvfi"},{"lat":44.443313263435776,"lng":26.02773242099613,"name":"vpyvg"},{"lat":44.43387564810446,"lng":26.030307341650428,"name":"gqijlhnss"},{"lat":44.42811427655959,"lng":26.019835997656287,"name":"aqrzomyc"},{"lat":44.423823524552255,"lng":26.007819701269568,"name":"lxvyegmuh"},{"lat":44.405676291549064,"lng":26.001983214453162,"name":"vewgnakyi"}];
}

function getCloseClubs() {
    return [{"lat":44.430715352415525,"lng":26.05184555053711,"name":"hqqbgew"},{"lat":44.44137909691852,"lng":26.097164154052734,"name":"poamrzb"},{"lat":44.42752810855755,"lng":26.087207794189453,"name":"srqsajvxe"},{"lat":44.42090789289679,"lng":26.031246185302734,"name":"ghamoq"},{"lat":44.44662219614843,"lng":26.001983214453162,"name":"mfkqpbvad"},{"lat":44.46573680410561,"lng":26.03271060092777,"name":"ekofrhcb"},{"lat":44.45581269247562,"lng":26.025844145849646,"name":"liuywbagxs"},{"lat":44.46206140389331,"lng":26.058288146093787,"name":"appyaayn"},{"lat":44.45078873368656,"lng":26.0424952994141,"name":"rhsn"},{"lat":44.43681740601164,"lng":26.006618071630896,"name":"vgsedan"},{"lat":44.422229736448095,"lng":25.990481902197303,"name":"vgisxtvj"},{"lat":44.414627995422435,"lng":26.01623110874027,"name":"hvorjitrbx"},{"lat":44.41266609537236,"lng":26.048846770361365,"name":"wiaqtigr"},{"lat":44.40297824911097,"lng":26.06566958530277,"name":"mhsncea"},{"lat":44.40346881153706,"lng":26.031852294043006,"name":"kmvzhjqhdj"},{"lat":44.41070412950483,"lng":26.09588198764652,"name":"bbryeys"},{"lat":44.41867420641035,"lng":26.071849394873084,"name":"xygioy"},{"lat":44.40604419678582,"lng":26.08592562778324,"name":"sqmsiqjj"},{"lat":44.42639801355065,"lng":26.109443236425818,"name":"nzjkfyqdk"},{"lat":44.43914619266125,"lng":26.116996337011756,"name":"wkzslrxzl"},{"lat":44.46451169641235,"lng":26.108069945410193,"name":"ihplumprm"},{"lat":44.4703919788565,"lng":26.100001860693396,"name":"wxgavylxs"},{"lat":44.45314372899653,"lng":26.084632873535156,"name":"azyhaseb"},{"lat":44.45017602621822,"lng":26.069102812841834,"name":"tzzjckhg"},{"lat":44.444293707483226,"lng":26.06172137363285,"name":"uprjhhvfi"},{"lat":44.443313263435776,"lng":26.02773242099613,"name":"vpyvg"},{"lat":44.43387564810446,"lng":26.030307341650428,"name":"gqijlhnss"},{"lat":44.42811427655959,"lng":26.019835997656287,"name":"aqrzomyc"},{"lat":44.423823524552255,"lng":26.007819701269568,"name":"lxvyegmuh"},{"lat":44.405676291549064,"lng":26.001983214453162,"name":"vewgnakyi"}];
}

rec_hotels = [];
rec_museums = [];
rec_restaurants = [];
rec_clubs = [];

hotel_page = 0;
museum_page = 0;
restaurant_page = 0;
club_page = 0;

colors = ["#037FE6", "#1AA2E6", "#366AE6", "#5998E6", "#0C2554", "#0C25B0", "#040B36", "#042536"];
nritems = 0;

function setupGeolocation(position) {
    rec_hotels = getCloseHotels();
    rec_museums = getCloseMuseums();
    rec_restaurants = getCloseRestaurants();
    rec_clubs = getCloseClubs();

    applySuggestions();
}

function applySuggestions() {
    var widthString = window.getComputedStyle(document.getElementById("recommend-hotels")).width.toString();
    nritems = Math.floor((widthString.substring(0, widthString.length - 2) - 90) / 90);
    console.log(nritems);

    document.getElementById("recommend-hotels").innerHTML = '<button type="button" class="recommend-left"><i class="fa fa-caret-left"></i></button>';
    document.getElementById("recommend-museums").innerHTML = '<button type="button" class="recommend-left"><i class="fa fa-caret-left"></i></button>';
    document.getElementById("recommend-restaurants").innerHTML = '<button type="button" class="recommend-left"><i class="fa fa-caret-left"></i></button>';
    document.getElementById("recommend-clubs").innerHTML = '<button type="button" class="recommend-left"><i class="fa fa-caret-left"></i></button>';

    for (var i = 0; i < nritems; i++) {
        hotel = rec_hotels[i+hotel_page*nritems];
        document.getElementById("recommend-hotels").innerHTML +=
            '<div class="recommend-square" style="background-color: ' + colors[Math.floor(Math.random()*colors.length - 0.01)] + '">' + hotel.name + '</div>';

        museum = rec_museums[i+museum_page*nritems];
        document.getElementById("recommend-museums").innerHTML +=
            '<div class="recommend-square" style="background-color: ' + colors[Math.floor(Math.random()*colors.length - 0.01)] + '">' + museum.name + '</div>';

        restaurant = rec_restaurants[i+restaurant_page*nritems];
        document.getElementById("recommend-restaurants").innerHTML +=
            '<div class="recommend-square" style="background-color: ' + colors[Math.floor(Math.random()*colors.length - 0.01)] + '">' + restaurant.name + '</div>';

        club = rec_clubs[i+club_page*nritems];
        document.getElementById("recommend-clubs").innerHTML +=
            '<div class="recommend-square" style="background-color: ' + colors[Math.floor(Math.random()*colors.length - 0.01)] + '">' + club.name + '</div>';
    };


    document.getElementById("recommend-hotels").innerHTML += '<button type="button" class="recommend-right"><i class="fa fa-caret-right"></i></button>';
    document.getElementById("recommend-museums").innerHTML += '<button type="button" class="recommend-right"><i class="fa fa-caret-right"></i></button>';
    document.getElementById("recommend-restaurants").innerHTML += '<button type="button" class="recommend-right"><i class="fa fa-caret-right"></i></button>';
    document.getElementById("recommend-clubs").innerHTML += '<button type="button" class="recommend-right"><i class="fa fa-caret-right"></i></button>';

}

setupGeolocation();

window.addEventListener('resize', function(){
    setupGeolocation();
}, true);