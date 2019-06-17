// code to retrieve the location of the user. PUT ALL YOUR CODES UNDER LINE 67
var latitude;
var longitude;
var businessId = [];
var reviewURL;

function ipLookUp() {
    $.ajax('http://ip-api.com/json')
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
    var restaurantURLBase = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/";
    var term = "";
    var restaurantURL;

    function restaurantQueryURL() {

        // Grab text the user typed into the search input, add to the queryParams object
        term = $("#search-term").val().trim();
        restaurantURL = restaurantURLBase + "search?term=" + term + "&latitude=" + latitude + "&longitude=" + longitude;


        // Logging the URL so we have access to it for troubleshooting
        console.log("---------------\nURL: " + restaurantURL + "\n---------------");
        return restaurantURL;
    }
    // Function to empty out the restaurants
    function clear() {
        $("#restaurant-section").empty();
    }


    function updatePage(response) {
        // Get from the form the number of results to display
        // API doesn't have a "limit" parameter, so we have to do this ourselves
        console.log(response);
        console.log("------------------------------------");
        for (let i = 0; i < 5; i++) {
            var restaurantCount = i + 1;
            // Getting Reviews
            // console.log("ID# : ", response.businesses[i].id);
            reviewURL = restaurantURLBase + response.businesses[i].id + "/reviews";
            // console.log(reviewURL);
            var restaurantList = $(`<ul data-number=${restaurantCount}>`);
            $.ajax({
                url: reviewURL,
                method: "GET",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer 3wWOAvaGNXrcyeiEyHu-LozubQFqCpPz8_zacZInc3dFC9Dqgy8yuMqUFwRoj9dnb1xhuNPqMP2tY1NTGiq60ACjN-cRCMfIViTZJYkuWvej58Glaemaz2Pv_1AEXXYx");
                },
            }).then(function(response) {
                console.log(restaurantCount)
                console.log(response.reviews[0].text);
                $(restaurantList).attr("data-number", restaurantCount).append(
                    "<h4> Review:  " + response.reviews[0].text + "</h4>"
                );
            });

            // Getting Business Info

            restaurantList.addClass("list-group");

            // Add the newly created element to the DOM
            $("#restaurant-section").append(restaurantList);

            // append to restaurantList
            var restaurantName = response.businesses[i].name;
            var restaurantListItem = $(`<li class='list-group-item restaurantHeadName'>`);
            console.log("NAME: ", response.businesses[i].name);
            restaurantListItem.append(
                "<span class='label label-primary'>" +
                restaurantCount +
                "</span>" +
                "<strong><h3>" +
                restaurantName +
                "</strong></h3>"
            );

            if (!response.businesses[i].is_closed) {
                console.log("It's open now!");
                restaurantListItem.append(
                    "<h4> It's Open Now! </h4>"
                );
            } else {
                console.log("It's closed now");
                restaurantListItem.append(
                    "<h4> It's Closed Now! </h4>"
                );
            }

            console.log("PHONE NUMBER: ", response.businesses[i].display_phone);
            restaurantListItem.append(
                "<h4> Phone Number:  " + response.businesses[i].display_phone + "</h4>"
            );
            console.log("PRICING RATE: ", response.businesses[i].price);
            if (response.businesses[i].price) {
                restaurantListItem.append(
                    "<h4> PRICING RATE:  " + response.businesses[i].price + "</h4>"
                )
            }

            // for (let j = 0; j < response.businesses[i].location.display_address.length; j++) {
            //     console.log(response.businesses[i].location.display_address[j]);
            // }
            restaurantListItem.append(
                "<h4> Address:  " + response.businesses[i].location.display_address.join(", ") + "</h4>"
            )

            console.log("IMAGE LINK: " + response.businesses[i].image_url);
            restaurantListItem.append(
                `<img src='${response.businesses[i].image_url}' style='height: 200px; width:300px;'/>`
            )




            //Add to the DOM
            restaurantList.append(restaurantListItem);


        }

    }

    // CLICK HANDLERS
    // ==========================================================
    // .on("click") function associated with the Search Button
    $("#run-search").on("click", function(event) {
        event.preventDefault();

        // Empty the region associated with the articles
        clear();

        recipeLooker();

        // Build the query URL for the ajax request to the NYT API
        var restaurantURL = restaurantQueryURL();

        // Make the AJAX request to the API - GETs the JSON data at the queryURL.
        // The data then gets passed as an argument to the updatePage function
        $.ajax({
            url: restaurantURL,
            method: "GET",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer 3wWOAvaGNXrcyeiEyHu-LozubQFqCpPz8_zacZInc3dFC9Dqgy8yuMqUFwRoj9dnb1xhuNPqMP2tY1NTGiq60ACjN-cRCMfIViTZJYkuWvej58Glaemaz2Pv_1AEXXYx");
            },
        }).then(updatePage);
    });




    // Edamam API
    // API id: b2b8d0a4	
    // API Key: bd57f73feb2c8d5694f586f9b86be099
    // href = "https://api.edamam.com/api/food-database/parser?..."


    // How to search for things with spaces
    // As an example, let’s say we want to find matches in the food database for a red apple. 
    // We then need to URL-encode this string.
    //  In this case, this means to just replace the spaces with %20,so it becomes “red%20apple” 
    //  Please note, that the quotation marks aren’t part of the string.


    // ingr = the food you're looking for

    // This is your link
    // 'https://api.edamam.com/api/food-database/parser?ingr=red%20apple&app_id={your app_id}&app_key={your app_key}'

    // text = food
    // label = food


    // $.ajax({
    //     url: queryURL,
    //     method: "GET"
    // })

    var edamamLink = "https://api.edamam.com/api/food-database/parser?ingr=";
    var edamamKey = "bd57f73feb2c8d5694f586f9b86be099";
    var edamamId = "b2b8d0a4";
    var foodChoice = "";
    // Make some function that tests to see if there's a space in the food item
    // ingr = food you're looking for

    // Runs on click of recipes and then search

    function recipeLooker() {
        var recipe = $("#search-term").val();
        console.log(recipe);
        console.log("hellooooo");

        var recipePlace = $('<div>');
        // Replace all spaces in food with %20 because API uses URL-Encode 
        for (i = 0; i < recipe.length; i++) {
            if (recipe[i] === " ") {
                console.log("hi");
                recipe[i] = "%20";
            }
        }


        $.ajax({
            url: edamamLink + recipe + "&app_id=" + edamamId + "&app_key=" + edamamKey,
            method: "GET"
        })

        .then(function(response) {
            console.log(response);

            var recipes = response.data;

            // Double check if need to use closing tag stuff

            for (i = 0; i < 5; i++) {
                var singleRecipe = $('<div id="indivRecipe">');
                // Just put the data inside here
                $("#indivRecipe").html(response.data);
                recipePlace.append(singleRecipe);
                recipePlace.appendTo("#restaurant-section");
            }





        })


    }



});