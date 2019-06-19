// code to retrieve the location of the user. PUT ALL YOUR CODES UNDER LINE 67
var latitude;
var longitude;
var businessId = [];
var reviewURL = [];

function ipLookUp() {
    $.ajax('http://ip-api.com/json')
        .then(
            function success(response) {
                console.log(response);
                console.log('Latitude ', response.lat);
                latitude = response.lat;
                console.log('Longitude ', response.lon);
                longitude = response.lon;
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
        $("#recepies-section").empty();

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
            reviewURL[i] = restaurantURLBase + response.businesses[i].id + "/reviews";
            // console.log(reviewURL);
            var restaurantList = $(`<ul>`);


            // Getting Business Info

            restaurantList.addClass("list-group");

            // Add the newly created element to the DOM
            $("#restaurant-section").append(restaurantList);

            // console.log(response.businesses[i].name);

            // append to restaurantList
            var restaurantName = response.businesses[i].name;
            var restaurantListItem = $(`<li class='list-group-item restaurantHeadName' data-number=${restaurantCount}>`);
            // console.log("NAME: ", response.businesses[i].name);
            restaurantListItem.append(
                // "<span class='label label-primary'>" +
                // restaurantCount +
                // "</span>" +
                "<strong><h3 class='text-center'>" +
                restaurantName +
                "</strong></h3>"
            );
            var tempDiv = $("<div class='text-center'>");


            if (!response.businesses[i].is_closed) {
                // console.log("It's open now!");
                tempDiv.append(
                    "<span class='text-center'>  <strong>Open</strong> Now! </span>"
                );
            } else {
                // console.log("It's closed now");
                tempDiv.append(
                    "<span class='text-center'> It's <strong>Closed Now!</strong> </span>"
                );
            }
            // console.log("Pricing Rate: ", response.businesses[i].price);
            if (response.businesses[i].price) {
                tempDiv.append(
                    "<span class='text-center'> |  <i class='fas fa-money-bill-wave'></i><strong>  " + response.businesses[i].price + "</strong></span>"
                )
            }

            if (response.businesses[i].rating) {
                tempDiv.append(
                    "<span class='text-center'> |   <i class='fas fa-star'></i><strong>  " + response.businesses[i].rating + "</strong> /5.0</span>"
                )
            }

            restaurantListItem.append(tempDiv);

            var tempDiv2 = $("<div class='text-center'>");

            // console.log("PHONE NUMBER: ", response.businesses[i].display_phone);
            tempDiv2.append(
                "<span class='text-center'> <i class='fas fa-phone'></i><strong> " + response.businesses[i].display_phone + "</strong></span>"
            );



            // for (let j = 0; j < response.businesses[i].location.display_address.length; j++) {
            //     console.log(response.businesses[i].location.display_address[j]);
            // }

            tempDiv2.append(
                "<span> |    <i class='fas fa-map-marker-alt'></i><strong>  " + response.businesses[i].location.display_address.join(", ") + "</strong></span>"
            )

            restaurantListItem.append(tempDiv2);

            // console.log("IMAGE LINK: " + response.businesses[i].image_url);
            restaurantListItem.append(
                "<h6 class='text-center'> To see the location on Google Maps, click on the image below! </h6>" +
                `<img src='${response.businesses[i].image_url}' data-num=${restaurantCount}
                param=${restaurantName.split(' ').join('+')}
                img-lat=${response.businesses[i].coordinates.latitude} 

                img-lon=${response.businesses[i].coordinates.longitude} class='text-center food-img' style='margin-left:18%;
                border: 1px solid #ddd; border-radius: 8px; padding: 5px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                transition: .5s ease; transform: translate(0, 0);'/>`
            )




            //Add to the DOM
            restaurantList.append(restaurantListItem);


        }

        for (let i = 0; i < 5; i++) {
            $.ajax({
                url: reviewURL[i],
                method: "GET",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer 3wWOAvaGNXrcyeiEyHu-LozubQFqCpPz8_zacZInc3dFC9Dqgy8yuMqUFwRoj9dnb1xhuNPqMP2tY1NTGiq60ACjN-cRCMfIViTZJYkuWvej58Glaemaz2Pv_1AEXXYx");
                },
            }).then(function(response) {
                // console.log(response);
                // console.log(response.reviews[0].text);
                $(`li[data-number=${i+1}]`).append(
                    "<h5 class='text-center'> Yelp Review: <p> <i class='fas fa-comment'></i><strong> " + response.reviews[0].text + " </strong></p></h5>"
                );
            });
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

        // Build the query URL for the ajax request to the YELP API
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


        $("#search-term").val("");
    });
    var newDivMap = $("<div>");
    //  click event for Google Maps
    $(document.body).on("click", ".food-img", function(event) {

        newDivMap.empty();
        var lat = $(this).attr("img-lat");
        var lon = $(this).attr("img-lon");
        var dataNum = $(this).attr("data-num");
        var restaurantQparam = $(this).attr("param");
        // console.log(restaurantQparam);
        console.log(lat);
        console.log(lon);

        // Show the location on map using Google Maps API
        //  I have the code for URL ready, Code can be added later, to protect the API Code
        var basicGoogleURL = "https://www.google.com/maps/embed/v1/place?";
        var GoogleKey = "key=AIzaSyDrxn_A75NUrlGA6RtTj1k5C1Axbc8S9QE";
        var mapAddress = basicGoogleURL + GoogleKey + "&q=" + restaurantQparam + "&center=" + lat + "," + lon;
        console.log(mapAddress);
        newDivMap = $("<div style='margin-left: 18%;'>");
        newDivMap.append($(`<iframe
        width="300px" 
        height="200px" 
        frameborder="0" 
        src= ${mapAddress}
        allowfullscreen></iframe>`));

        $(`li[data-number=${dataNum}]`).append(newDivMap);

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

    var edamamLink = "https://api.edamam.com/search?q=";
    var edamamKey = "02b3dc4e32fc0237061d8bb43d5748e4";
    var edamamId = "28d7bc82";
    var foodChoice = "";
    var recipeImage;

    // Make some function that tests to see if there's a space in the food item
    // ingr = food you're looking for

    // Runs on click of recipes and then search

    function recipeLooker() {
        var recipe = $("#search-term").val();
        console.log(recipe);
        console.log("hellooooo");

        // var recipePlace = $('<div>');
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


            var recipes = response;

            // Double check if need to use closing tag stuff

            for (i = 0; i < 5; i++) {
                var singleRecipe = $('<div id="indivRecipe" class="flip-card">');
                

                var singleRecipeHoldCards = $('<div class="flip-card-inner">');
                var frontPic = $('<div class="flip-card-front" style="width:75%">');

                var backIngredients = $('<div class="flip-card-back" style="width:75%">');


                singleRecipeHoldCards.append(frontPic);
                singleRecipeHoldCards.append(backIngredients);
                singleRecipe.append(singleRecipeHoldCards);
                

                var imgElement = $('<img class="card-img-top">');
                frontPic.append(imgElement);

                
                var name = $('<h3><strong>' + response.hits[i].recipe.label + '</strong></h3>');
                
                frontPic.append(name);
                frontPic.append('<p class="hover"> Hover over to see ingredients and steps! </p>');
                var calories = $('<p>' + Math.round(response.hits[i].recipe.calories) + ' calories </p>');
                frontPic.append(calories);

                var instructions = response.hits[i].recipe.url;
                

                recipeImage = response.hits[i].recipe.image;
                imgElement.attr("src", recipeImage);
                frontPic.append(imgElement);


                backIngredients.append('<h5>Ingredients</h5>');
                for(j = 0; j < response.hits[i].recipe.ingredientLines.length; j++){
                    var ingredients = $('<ul> <li>' + response.hits[i].recipe.ingredientLines[j] + '</li></ul>');
                    backIngredients.append(ingredients);
                }

                var link = $('<a href="' + instructions + '" class="btn btn-success" style="width:70%;">Steps</a>');
                backIngredients.append(link);
    
                

                // singleRecipe.append('<h5>Nutritional Facts</h5>');
                // for(h = 0; h < 9; h++){
                //     var nutrition = response.hits[i].recipe.digest[h].label;
                //     singleRecipe.append('<ul><li>Total ' + nutrition +  ' = ' + Math.round(response.hits[i].recipe.digest[h].total) + '</li>');
                // }

                // $("#indivRecipe").html(response.data);
                // recipePlace.append(singleRecipe);
                singleRecipe.appendTo("#recepies-section");
            }


{/* <div class="card" style="width: 18rem;">
  <img class="card-img-top" src="..." alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div> */}






        })


    }



});