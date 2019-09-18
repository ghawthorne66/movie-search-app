
// //Create an event listener to search movie by title

// ////////////////USED///////////////////

// var movieName;

// var moviesAndRootIDs = [];

// $("#submit").on('click', function(){
//  movieName = $("#movie-input").val().trim;
//  alert('you clicked me!');
//  console.log(movieName)
 
// })
// ////////////////USED///////////////////

// // Creating an AJAX call for the specific movie button being clicked

// ////////////////USED///////////////////

// var gracenoteQueryURL = "http://data.tmsapi.com/v1.1/movies/showings?startDate=2019-09-17&zip=92101&lat=32.7157&lng=-117.1611&radius=100&units=mi&imageSize=Md&imageText=true&api_key=ggxa8rz4a4a3sxvsf5xggtu5";
// console.log(gracenoteQueryURL);
//   ////////////////USED///////////////////
// //create an event that when clicked will search zip code
//   //display title, theatre, showtimes

// //array = [{
//    // movieName: tmsID

// //}]
// ////////////////USED///////////////////
//    var theatreNameArray = [];

// // Creating an AJAX call for the specific movie button being clicked
// $.ajax({
//   url: gracenoteQueryURL,
//   method: "GET"
// }).then(function(response) {
//   console.log(response);


//   for (var i = 0; i < response.length; i++) {
//     var movieTitle = response[i].title;
//     var movieRootID = response[i].rootId;
  
//     var tempObj = {};
//     tempObj[movieTitle] = movieRootID;

//     moviesAndRootIDs.push(tempObj);

//   }
  


//   console.log(moviesAndRootIDs);
// ////////////////USED///////////////////
  
//   // create an element to hold the text
//   // append that element to the page

//   //  $(document).ready(function () {
//   //movie, theatre name and place,showtimes;
// ////////////////USED///////////////////
//    var showtimeRow = response.showtimes;
//   $("#movie-showtimeRow").text(showtimeRow);
  

//   // loop through the response, limit to 5 results 
//   for (i = 0; i < response.length; i++) {
//     // create an element to hold the theater name

//     var newArrItem = response[i].showtimes[0].theatre.name

//     if (theatreNameArray.indexOf(newArrItem) === -1) {
//         theatreNameArray.push(newArrItem)

//     }
// ////////////////USED///////////////////
    
// // console.log(theatreNameArray);

// ////////////////USED///////////////////
//     var theatreElement = $("<p>");

//     ////////////////USED///////////////////
    
//     // set the text of that element = the theater name 
//     // theatreElement.text(response[i].showtimes[0].theatre.name)
//     // append that element to the page 
//     // $("#theatre-display").append(theatreElement);

//     // showtimeObject = response[i].showtimes;

//     // for (j = 0; j < showtimeObject.length; j++) {
//     //   var theatre = $("<td>").text(showtimeObject[i].theatre.name);

//     //   showtimeRow.text(theatre);
//     //   datetime = $("<td>").text(showtimeObject[i].dateTime);
//     //   showtimeRow.append(datetime);

//     //   $("#time-table").append(text);
//     // }

//     ////////////////USED///////////////////////////////////USED///////////////////
//   }
// }, function(error) {
//   console.log(error);
// })

////////////////USED///////////////////





////////////NEW CODE//////////////////////


// Global Object to Hold Movie Query Data ==============================================================================
let currentMovies = {};
// Functions ===========================================================================================================
// To Display the Initial List of All Movies playing nearby.
function displayMovies() {
    console.log(" ")
    console.log(" ")
    console.log(" ")
    console.log("=========================================== displayMovies ================================")
    let movieCard = `<div class="card text-center border-light bg-transparent">
                        <div class="card-header bg-transparent border-light text-white">Currently Playing Nearby</div>
                        <div class="card-body" id="movie-title-display">`;

    $("#column-1").append(movieCard);

    for (var k = 0; k < currentMovies.length; k++) {
        let movieTitle = currentMovies[k].title;

        let movieCardTitle = `<a href="javascript:;" class="movie-title" id="${k}">
                                <p class="card-text text-white">${movieTitle}</p></a>`;

        $("#movie-title-display").append(movieCardTitle);
        console.log("=========================================== DONE with displayMovies ================================")

    }

}

// To Display the Playing Times of the Movie, once selected.
function displayShowtimes(key) {
    console.log(currentMovies[key]);

    // To Prevent Error In Displaying Movie Times if the Movie does not have a listed rating.
    let rated;
    let ratings = currentMovies[key].ratings;
    if (ratings !== undefined) {
        let r = ratings[0];
        rated = r.code;
    } else {
        rated = "NA";
    }

    let title = currentMovies[key].title;
    let releaseDate = moment(currentMovies[key].releaseDate).format('D MMM YY');
    let short = currentMovies[key].shortDescription;
    let movieURL = currentMovies[key].officialUrl;
    let showtimes = currentMovies[key].showtimes;
    console.log(showtimes);

    let movieCard = `<div class="card text-center border-light bg-transparent">
                        <h5 class="card-header bg-transparent border-light text-white">${title} (${rated})</h5>
                        <div class="card-body" id="movie-data-display">
                            <p class="card-text text-white">Released: ${releaseDate}</p>
                            <p class="card-text text-white">${short}</p>
                            <a href="${movieURL}" target="_blank"><p class="card-text text-white">Official Website</p></a>
                            <table class="table table-hover" id="ticket-times">
                              <thead>
                                <tr>
                                  <th scope="col"><p class="text-white">Time</p></th>
                                  <th scope="col"><p class="text-white">Theater</p></th>
                                  <th scope="col"><p class="text-white">Tickets</p></th>
                                </tr>
                              </thead>
                              <tbody></tbody>
                              </table>
                        </div>
                    </div>`;

    $("#column-3").append(movieCard);

    for (var m = 0; m < showtimes.length; m++) {
        let currentTime = moment();
        /*.format("h:mm A");*/
        /*console.log(currentTime);*/
        let screeningAdj = moment(showtimes[m].dateTime);
        /*.format("h:mm A");*/
        /*console.log(screeningAdj);*/
        let diff = screeningAdj.diff(currentTime, 'minutes');
        if (diff > 0) {
            console.log(diff);

            let venue = showtimes[m].theatre.name;
            let ticketURL = showtimes[m].ticketURI;

            let ticketTimeData = `<tr>
                                  <td><p class="text-white">${screeningAdj.format("h:mm A")}</p></td>
                                  <td><p class="text-white">${venue}</p></td>
                                  <td><a href="${ticketURL}" target="_blank"><p class="text-white">Link</p></a></td>
                                </tr>`;

            $("#ticket-times tbody").append(ticketTimeData);


        } else {
            console.log('Showtime Passed');
        }

    }

}

// To fully reset the page without having to refresh.  Otherwise another movie can simply be selected from the list,
// and the videos and playing times for it will be shown.
function resetPage() {
    let locationSearchCard = `<div class="card text-center border-light bg-transparent" id="location-search-card">
                                    <div class="card-header bg-transparent border-light text-white">
                                        Search for Movies
                                    </div>
                                    <div class="card-body">
                                        <form>
                                            <div class="form-group mb-0 text-white text-center">
                                                <label for="inputZip" class="form-label">Zip:</label>
                                            </div>
                                            <div class="form-group text-center">
                                                <input type="number" name="quantity" class="form-control" id="inputZip" placeholder="30345">
                                            </div>
                                            <div class="form-group text-center">
                                                <button class="btn btn-outline-light" id="submit-zip" type="submit">Submit</button>
                                            </div>
                                            <div class="form-group mb-0 text-white text-center">
                                                <p class="text-center">Or</p>
                                            </div>
                                            <div class="form-group text-white text-center">
                                                <button class="btn btn-outline-light" id="use-location" type="submit">Use My Location</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>`;

    $("#search-column").append(locationSearchCard);
}

// API Query Functions =================================================================================================
// Based on Zip Code Input
function queryZGracenoteAPI(date, zipCode) {
    console.log(" ")
    console.log(" ")
    console.log(" ")
    console.log("=========================================== queryZGracenoteAPI ================================")
    let apiKey = 'zmxbv8fhjnt7j6q4uedn4vpv';
    let queryURL = `https://data.tmsapi.com/v1.1/movies/showings?startDate=${date}&zip=${zipCode}&api_key=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            currentMovies = response;
            // console.log(response);
            console.log("Got a response: " + JSON.stringify(response))
            displayMovies();

        }).catch(console.log)

}

// Based on HTML Location Data
function queryLGracenoteAPI(date, lat, lng) {

    let apiKey = 'zmxbv8fhjnt7j6q4uedn4vpv';
    let queryURL = `https://data.tmsapi.com/v1.1/movies/showings?startDate=${date}&lat=${lat}&lng=${lng}&api_key=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            currentMovies = response;
            // console.log(response);
            displayMovies();

        }).catch(console.log)

}

// Query YouTube for movie trailers/videos - Currently Set for 6.
function queryYoutubeAPI(key) {

    let resultsNum = "6";
    let searchMovie = `${currentMovies[key].title} movie 2018`;
    let apiKey = 'AIzaSyBxq4l59TeNIU8ISsodXpdxmvnMZIWa3LU';
    let queryURL = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&maxResults=${resultsNum}&part=snippet&q=${searchMovie}&type=video`;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            let snippets = response.items;
            let videos = [];

            for (var k = 0; k < snippets.length; k++) {
                videos.push(`https://www.youtube.com/embed/${snippets[k].id.videoId}`);
            }

            for (var v = 0; v < snippets.length; v++) {
                let movieVideo = $(`<div class="row mb-3"><div class="embed-responsive embed-responsive-16by9">
                                <iframe class="embed-responsive-item" src=${videos[v]} allowfullscreen></iframe>
                                    </div></div>`);

                $("#column-2").append(movieVideo);
            }

        }).catch(console.log);

}

// Button Click Functions ==============================================================================================
$("#reset-search").on("click", function (event) {
    event.preventDefault();
    console.log('Reset');

    $("#column-1, #column-2, #column-3").empty();
    resetPage();
    $("#reset-search").hide();

});

$("#firebase-login").on("click", function (event) {
    event.preventDefault();
    console.log("Login");

    $("#login-modal").modal('show');

});

$("#firebase-signout").on("click", function (event) {
    event.preventDefault();
    console.log("Sign-out");

    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });

});

// Dynamic Button Functions ============================================================================================
// $(document).on("click", "#submit-zip", function (event) {
//     event.preventDefault();
//     console.log(" ")
//     console.log(" ")
//     console.log(" ")
//     console.log("=========================================== Search By Zip Code ================================")
//     let zipCode = $("#inputZip").val().trim();
//     console.log(`Search by Zip: ${zipCode}`);

//     let date = moment().format('YYYY-MM-DD');
//     console.log(date);

//     queryZGracenoteAPI(date, zipCode);

//     $("#inputZip").val("");
//     $("#search-column").empty();
//     $("#reset-search").show();

// });


$(document).on("click", "#search", function (event) {
  event.preventDefault();
  console.log(" ")
  console.log(" ")
  console.log(" ")
  console.log("=========================================== Search By Zip Code ================================")
  let zipCode = $("#zipCode").val().trim();
  console.log(`Search by Zip: ${zipCode}`);

  let date = moment().format('YYYY-MM-DD');
  console.log(date);

  queryZGracenoteAPI(date, zipCode);

  // $("#inputZip").val("");
  // $("#search-column").empty();
  // $("#reset-search").show();

});

$(document).on("click", "#use-location", function (event) {
    event.preventDefault();
    /*console.log("Search using my location");*/
    navigator.geolocation.getCurrentPosition(granted, denied);

    function granted(position) {
        let userLat = position.coords.latitude;
        let userLong = position.coords.longitude;

        /*console.log(`Position is ${userLat} x ${userLong}`);*/
        let date = moment().format('YYYY-MM-DD');

        queryLGracenoteAPI(date, userLat, userLong);

        $("#search-column").empty();
        $("#reset-search").show();
    }

    function denied(error) {
        let message;
        switch (error.code) {
            case 1:
                message = 'Permission Denied';
                break;
            case 2:
                message = 'Position Unavailable';
                break;
            case 3:
                message = 'Operation Timed Out';
                break;
            case 4:
                message = 'Unknown Error';
                break;
        }
        console.log(`GeoLocation Error: ${message}`)
    }

});

$(document).on("click", ".movie-title", function () {
    let key = $(this).attr("id");

    $("#column-2, #column-3").empty();

    queryYoutubeAPI(key);
    displayShowtimes(key);

});
