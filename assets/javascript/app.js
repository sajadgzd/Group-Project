// code to retrieve the location of the user if neede: Please do not remove


// function ipLookUp() {
//     $.ajax('http://ip-api.com/json')
//         .then(
//             function success(response) {
//                 console.log('User\'s Location Data is ', response);
//                 console.log('User\'s Country', response.country);
//                 getAddress(response.lat, response.lon)
//             },

//             function fail(data, status) {
//                 console.log('Request failed.  Returned status of',
//                     status);
//             }
//         );
// }

// ipLookUp();

// function getAddress(latitude, longitude) {
//     $.ajax('https://maps.googleapis.com/maps/api/geocode/json?' +
//             'latlng=' + latitude + ',' + longitude + '&key=' +
//             GOOGLE_MAP_KEY)
//         .then(
//             function success(response) {
//                 console.log('User\'s Address Data is ', response)
//             },
//             function fail(status) {
//                 console.log('Request failed.  Returned status of',
//                     status)
//             }
//         )
// }
// if ("geolocation" in navigator) {
//     // check if geolocation is supported/enabled on current browser
//     navigator.geolocation.getCurrentPosition(
//         function success(position) {
//             // for when getting location is a success
//             console.log('latitude', position.coords.latitude,
//                 'longitude', position.coords.longitude);
//             getAddress(position.coords.latitude,
//                 position.coords.longitude)
//         },
//         function error(error_message) {
//             // for when getting location results in an error
//             console.error('An error has occured while retrieving' +
//                 'location', error_message)
//             ipLookUp()
//         });
// } else {
//     // geolocation is not supported
//     // get your location some other way
//     console.log('geolocation is not enabled on this browser')
//         // ipLookUp()
// }
$(document).ready(function() {


    var restaurantURLBase = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/";
    $("#run-search").on("click", function() {

        var restaurantURL = restaurantURLBase + "businesses/north-india-restaurant-san-francisco/reviews";
        $.ajax({
            url: restaurantURL,
            method: "GET",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer 3wWOAvaGNXrcyeiEyHu-LozubQFqCpPz8_zacZInc3dFC9Dqgy8yuMqUFwRoj9dnb1xhuNPqMP2tY1NTGiq60ACjN-cRCMfIViTZJYkuWvej58Glaemaz2Pv_1AEXXYx");
            },
        }).then(function(response) {
            console.log(response);
            console.log(restaurantURL);
            console.log(response.reviews[0].rating);

        })

    });
















});