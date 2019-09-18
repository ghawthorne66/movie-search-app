// Global Object to Hold Movie Query Data ==============================================================================
let currentMovies = {};
// Functions ===========================================================================================================
// To Display the Initial List of All Movies playing nearby.
function displayMovies() {
    console.log(" ")
    console.log(" ")
    console.log(" ")
    console.log("=========================================== displayMovies ================================")
    let movieCard = `<div class="card text-center border-md bg-white">
                        <div class="card-header bg-white border-light text-black">Currently Playing Nearby</div>
                        <div class="card-body" id="movie-title-display">`;

    $("#theaters-col").empty();
    $("#showtimes-col").empty();
    $("#theaters-col").append(movieCard);

    for (var k = 0; k < currentMovies.length; k++) {
        let movieTitle = currentMovies[k].title;

        let movieCardTitle = `<a href="javascript:;" class="movie-title" id="${k}">
                                <p class="card-text text-black">${movieTitle}</p></a>`;

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

    let movieCard = `<div class="card text-center border-light bg-white">
                        <h5 class="card-header bg-transparent border-light text-black">${title} (${rated})</h5>
                        <div class="card-body" id="movie-data-display">
                            <p class="card-text text-black">Released: ${releaseDate}</p>
                            <p class="card-text text-black">${short}</p>
                            <a href="${movieURL}" target="_blank"><p class="card-text text-black">Official Website</p></a>
                            <table class="table table-hover" id="ticket-times">
                              <thead>
                                <tr>
                                  <th scope="col"><p class="text-black">Time</p></th>
                                  <th scope="col"><p class="text-black">Theater</p></th>
                                  <th scope="col"><p class="text-black">Tickets</p></th>
                                </tr>
                              </thead>
                              <tbody></tbody>
                              </table>
                        </div>
                    </div>`;

    $("#showtimes-col").append(movieCard);

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
                                  <td><p class="text-black">${screeningAdj.format("h:mm A")}</p></td>
                                  <td><p class="text-black">${venue}</p></td>
                                  <td><a href="${ticketURL}" target="_blank"><p class="text-black">Link</p></a></td>
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
                                    <div class="card-header bg-transparent border-light text-black">
                                        Search for Movies
                                    </div>
                                    <div class="card-body">
                                        <form>
                                            <div class="form-group mb-0 text-black text-center">
                                                <label for="inputZip" class="form-label">Zip:</label>
                                            </div>
                                            <div class="form-group text-center">
                                                <input type="number" name="quantity" class="form-control" id="inputZip" placeholder="30345">
                                            </div>
                                            <div class="form-group text-center">
                                                <button class="btn btn-outline-light" id="submit-zip" type="submit">Submit</button>
                                            </div>
                                            <div class="form-group mb-0 text-black text-center">
                                                <p class="text-center">Or</p>
                                            </div>
                                            <div class="form-group text-black text-center">
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
        .then(function(response) {
            currentMovies = response;
            // console.log(response);
            console.log("Got a response: " + JSON.stringify(response))
            displayMovies();

        }).catch(console.log)

}

// Button Click Functions ==============================================================================================
$("#reset-search").on("click", function(event) {
    event.preventDefault();
    console.log('Reset');

    $("#theaters-col, #showtimes-col").empty();
    resetPage();
    $("#reset-search").hide();

});


$(document).on("click", "#search", function(event) {
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

});

$(document).on("click", "#use-location", function(event) {
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

$(document).on("click", ".movie-title", function() {
    let key = $(this).attr("id");

    $("#movie-theater-trailer-col, #showtimes-col").empty();

    displayShowtimes(key);

});