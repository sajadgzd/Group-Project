// code to retrieve the location of the user. PUT ALL YOUR CODES UNDER LINE 67
var latitude;
var longitude;

function ipLookUp() {
    $.ajax('https://cors-anywhere.herokuapp.com/ip-api.com/json')
        .then(
            function success(response) {
                console.log(response);
                console.log('Latitude ', response.lat);
                latitude = response.lat;
                console.log('Longitude ', response.lon);
                longitude = response.lon;
                // getAddress(response.lat, response.lon)
            },

            function fail(data, status) {
                console.log('Request failed.  Returned status of',
                    status);
            }
        );
}
// ipLookUp();
if ("geolocation" in navigator) {
    // check if geolocation is supported/enabled on current browser
    navigator.geolocation.getCurrentPosition(
        function success(position) {
            // for when getting location is a success
            console.log('Geo latitude', position.coords.latitude,
                'Geo longitude', position.coords.longitude);
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            // getAddress(position.coords.latitude,
            //     position.coords.longitude)

            // Show the location on map using Google Maps API
            //  I have the code for URL ready, Code can be added later, to protect the API Code
            // $(document.body).append($(`<iframe 
            //         width="300" 
            //         height="200" 
            //         frameborder="0" 
            //         src= ${address3}
            //         allowfullscreen></iframe>`));
        },
        function error(error_message) {
            // for when getting location results in an error
            console.error('An error has occured while retrieving' +
                'location', error_message)
            ipLookUp()
        });
} else {
    // geolocation is not supported
    // get your location some other way
    console.log('geolocation is not enabled on this browser')
    ipLookUp()
}




// ALL CODES GOES INSIDE OF THIS .ready() FUNCTION::::::::::
$(document).ready(function() {

    // https: //api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972
    var restaurantURLBase = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/";
    $("#run-search").on("click", function() {

        var restaurantURL = restaurantURLBase + "businesses/search?term=chinese&latitude=" + latitude + "&longitude=" + longitude;
        $.ajax({
            url: restaurantURL,
            method: "GET",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer 3wWOAvaGNXrcyeiEyHu-LozubQFqCpPz8_zacZInc3dFC9Dqgy8yuMqUFwRoj9dnb1xhuNPqMP2tY1NTGiq60ACjN-cRCMfIViTZJYkuWvej58Glaemaz2Pv_1AEXXYx");
            },
        }).then(function(response) {
            console.log(response);
            console.log(restaurantURL);
            for (let i = 0; i < 10; i++) {
                console.log("NAME: ", response.businesses[i].name);
                console.log("PHONE NUMBER: ", response.businesses[i].display_phone);
                console.log("PRICING RATE: ", response.businesses[i].price);
                if (!response.businesses[i].is_closed) {
                    console.log("It's open now!");
                } else {
                    console.log("It's closed now");
                }

                for (let j = 0; j < response.businesses[i].location.display_address.length; j++) {
                    console.log(response.businesses[i].location.display_address[j]);
                }
            }

        })

    });
















});