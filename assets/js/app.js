// Variables for google maps functionality
let pos;
let map;
let bounds;
let infoWindow;
let currentInfoWindow;
let service;
let infoPane;
let markers = [];

$(document).ready(function () {

    // Gets movies from local storage; if empty, sets movies to an empty array
    var movies = JSON.parse(localStorage.getItem("movies") || "[]");

    // Populate favorites with movies if there are movies in the array
    if (movies.length > 0) {
        for (var i = 0; i < movies.length; i++) {
            addFavoriteCard(movies[i].title, movies[i].poster);
        }
    }

    $("#submit").on("click", function (event) {
        event.preventDefault();

        // Gets movie entered by user
        var movie = $("#movie-input").val().trim();

        // Clears input field
        $("#movie-input").text("");

        getMovieInfo(movie);
    })

    $("#search").on("click", function (event) {
        // Clear map 
        deleteMarkers();
        console.log("Searching...");
        console.log($("#zipCode"));
        var zipCode = $("#zipCode").val();

        console.log("-----------> Calling on getNearbyPlaces");
        console.log("-----------> Calling on zipCode: " + zipCode);
        getNearbyPlaces({ lat: 32.715736, lng: -117.161087 }, zipCode);
    })

    // Adds movie to favorites when heart is clicked
    $("#fav-heart").on("click", function () {
        // Add movie to favorites in local storage
        movies.push({ poster: $("#movie-poster").attr("src"), title: $("#movie-title").text() });
        localStorage.setItem("movies", JSON.stringify(movies));

        // Add movie to favorites on page
        addFavoriteCard($("#movie-title").text(), $("#movie-poster").attr("src"));
    })

    // When info is clicked, the movie's information will be displayed
    $("#list-favorites").on("click", ".info-btn", function () {
        getMovieInfo($(this).parent().parent().parent().attr("data-movie"));
    })

    // Removes movie from favorites
    $("#list-favorites").on("click", ".remove-btn", function () {
        var movieTitle = $(this).parent().parent().parent().attr("data-movie");

        // Returns first object in movie array that has a matching movie title to the current movie being removed
        function isMovieMatch(movie) {
            return movie.title === movieTitle;
        }

        // Removes movie from movies array
        var movieIndex = movies.findIndex(isMovieMatch);
        console.log(movieIndex);
        if (movieIndex > -1) {
            movies.splice(movieIndex, 1);
        }

        // Stores updated movies in localStorage
        localStorage.setItem("movies", JSON.stringify(movies));

        // Removes movie card from favorites
        $(this).parent().parent().parent().remove();
    })

    function getMovieInfo(movie) {
        var omdbQueryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";

        // Creating an AJAX call for the specific movie button being clicked
        $.ajax({
            url: omdbQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            //Title, Director, Genre, Plot, Poster, Rated, Released, Year, Runtime
            var director = response.Director;
            $("#movie-director").text(director);

            var rating = response.Rated;
            $("#movie-rated").text(rating);

            var title = response.Title;
            $("#movie-title").text(title);

            var genre = response.Genre;
            $("#movie-genre").text(genre);

            var plot = response.Plot;
            $("#movie-plot").text(plot);

            var imgURL = response.Poster;
            $("#movie-poster").attr("src", imgURL);

            var released = response.Released;
            $("#movie-release").text(released);

            var runtime = response.Runtime;
            $("#movie-runtime").text(runtime);

            var actors = response.Actors;
            $("#movie-actors").text(actors);

            var ratedIMDB = response.Ratings[0].Value;
            $("#imdb-score").text(ratedIMDB);

            var ratedRt = response.Ratings[1].Value;
            $("#rt-aud-score").text(ratedRt);

            var ratedMc = response.Ratings[2].Value;
            $("#metacritic-score").text(ratedMc);

        })


        // Youtube Trailer query
        var youtubeQueryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=" + movie + " trailer&key=AIzaSyANwe_R8GJEK-5rYI2aufq2Gh2HZjQcOJI";

        $.ajax({
            url: youtubeQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            // Clears out current placeholder trailer
            $("#trailer").empty();

            // Adds trailer to page
            var trailer = $("<iframe>").addClass("embed-responsive-item pr-3");
            trailer.attr("src", "https://www.youtube.com/embed/" + response.items[0].id.videoId);
            $("#trailer").append(trailer);
        });



       // ---------- Streaming Platforms Info ------------

        var streamQueryURL = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=" + movie + "&country=uk";
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": streamQueryURL,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
                "x-rapidapi-key": "5f71d6d19cmsh134bbd07fd39bcfp14243ajsncf174091dad8"
            }
        }

        $.ajax(settings).done(function (response) {
            console.log(response);

            for (var i = 0; i < response.results[0].locations.length; i++) {
                console.log(response.results[0].locations[i].display_name);

                // --- Check for Amazon Prime -----
                if (response.results[0].locations[i].display_name === "Amazon Prime") {
                    var icon = $("<i>").attr("class", "fas fa-check fa-2x");
                    var streamButton = $("<a>").attr("href",response.results[0].locations[i].url).attr("class", "button btn btn-success btn-block my-1").attr("target","_blank").text("Watch Now")
                    $("#amazon-prime-available").empty();
                    $("#amazon-prime-available").append(icon);
                    $("#stream-platform-amazon-prime").append(streamButton);
                }

                 // --- Check for Netflix -----
                if (response.results[0].locations[i].display_name === "Netflix") {
                    var icon = $("<i>").attr("class", "fas fa-check fa-2x");
                    var streamButton = $("<a>").attr("href",response.results[0].locations[i].url).attr("class", "button btn btn-success btn-block my-1").attr("target","_blank").text("Watch Now")
                    $("#netflix-available").empty();
                    $("#netflix-available").append(icon);
                    $("#stream-platform-netflix").append(streamButton);
                }

                 // --- Check for Amazon Instant -----
                if (response.results[0].locations[i].display_name === "Amazon Instant") {
                    var icon = $("<i>").attr("class", "fas fa-check fa-2x");
                    var streamButton = $("<a>").attr("href",response.results[0].locations[i].url).attr("class", "button btn btn-success btn-block my-1").attr("target","_blank").text("Watch Now")
                    $("#amazon-instant-available").empty();
                    $("#amazon-instant-available").append(icon);
                    $("#stream-platform-amazon-instant").append(streamButton);
                }

                 // --- Check for iTunes -----
                if (response.results[0].locations[i].display_name === "Itunes") {
                    var icon = $("<i>").attr("class", "fas fa-check fa-2x");
                    var streamButton = $("<a>").attr("href",response.results[0].locations[i].url).attr("class", "button btn btn-success btn-block my-1").attr("target","_blank").text("Watch Now")
                    $("#itunes-available").empty();
                    $("#itunes-available").append(icon);
                    $("#stream-platform-itunes").append(streamButton);
                }
            }
        });




    }

    // Adds a movie card to the list-favorites div
    function addFavoriteCard(title, poster) {
        var favoriteCard = $("<div>")
            .addClass("card favorite-card")
            .attr("data-movie", title); // Sets data to access later
        var cardBody = $("<div>").addClass("card-body fav-buttons-below");
        var buttonsDiv = $("<div>").addClass("btn-group fav-info-buttons");
        buttonsDiv.append(($("<button>")
            .attr("type", "button")
            .addClass("btn btn-secondary btn-sm btn-success info-btn")
            .text("Info")));
        buttonsDiv.append(($("<button>")
            .attr("type", "button")
            .addClass("btn btn-secondary btn-sm btn-danger remove-btn")
            .text("Remove")));
        cardBody.append(buttonsDiv);
        favoriteCard.append(($("<img>")
            .attr("src", poster)
            .addClass("card-img-top fav-img")));
        favoriteCard.append(cardBody);
        $("#list-favorites").append(favoriteCard);
    }
})

/* GOOGLE MAPS FUNCTIONS */

function initMap() {
    // Initialize variables
    bounds = new google.maps.LatLngBounds();
    infoWindow = new google.maps.InfoWindow;
    currentInfoWindow = infoWindow;

    infoPane = document.getElementById('panel');

    // HTML5 geolocation 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map = new google.maps.Map(document.getElementById('map'), {
                center: pos,
                zoom: 12
            });
            bounds.extend(pos);

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);

            // Call Places Nearby Search on user's location
            getNearbyPlaces(pos, "91910");
        }, () => {
            // Browser supports geolocation, but user has denied permission
            handleLocationError(true, infoWindow);
        });
    } else {
        // Browser doesn't support geolocation
        handleLocationError(false, infoWindow);
    }
}

// Handle a geolocation error
function handleLocationError(browserHasGeolocation, infoWindow) {
    // Set default location to SSan Diego, Ca
    pos = { lat: 32.715736, lng: -117.161087 };
    map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 50,
    });

    // Display an InfoWindow at the map center
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Geolocation permissions denied. Using default location.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
    currentInfoWindow = infoWindow;

    // Call Places Nearby Search on the default location
    getNearbyPlaces(pos, "91910");
}

// Perform a Places Nearby Search Request
function getNearbyPlaces(position, query) {
    console.log("----------------> query: " + query);

    var request = {
        location: position,
        radius: '500',
        query: query,
        type: ['movie_theater']
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, nearbyCallback);
}

// Handle the results (up to 20) of the Nearby Search
function nearbyCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        createMarkers(results);
    }
}

// Set markers at the location of each place result
function createMarkers(places) {
    places.forEach(place => {
        console.log("----------------------------------")
        console.log(" ")
        console.log(" ")
        console.log(" ")
        console.log("Result: " + JSON.stringify(place));
        console.log("Location: " + place.geometry.location);
        map.setCenter(place.geometry.location);
        let marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name
        });
        markers.push(marker);

        // Add click listener to each marker
        google.maps.event.addListener(marker, 'click', () => {
            let request = {
                placeId: place.place_id,
                fields: ['name', 'formatted_address', 'geometry', 'rating',
                    'website', 'photos'
                ]
            };

            service.getDetails(request, (placeResult, status) => {
                showDetails(placeResult, marker, status)
            });
        });

        // Adjust the map bounds to include the location of this marker
        bounds.extend(place.geometry.location);
    });


    map.fitBounds(bounds);
}

// InfoWindow to display details above the marker
function showDetails(placeResult, marker, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        let placeInfowindow = new google.maps.InfoWindow();
        let rating = "None";
        if (placeResult.rating) rating = placeResult.rating;
        placeInfowindow.setContent('<div><strong>' + placeResult.name +
            '</strong><br>' + 'Rating: ' + rating + '</div>');
        placeInfowindow.open(marker.map, marker);
        currentInfoWindow.close();
        currentInfoWindow = placeInfowindow;
        showPanel(placeResult);
    } else {
        console.log('showDetails failed: ' + status);
    }
}

// Displays place details in a sidebar
function showPanel(placeResult) {
    // If infoPane is already open, close it
    if (infoPane.classList.contains("open")) {
        infoPane.classList.remove("open");
    }

    // Clear the previous details
    while (infoPane.lastChild) {
        infoPane.removeChild(infoPane.lastChild);
    }

    if (placeResult.photos) {
        let firstPhoto = placeResult.photos[0];
        let photo = document.createElement('img');
        photo.classList.add('hero');
        photo.src = firstPhoto.getUrl();
        infoPane.appendChild(photo);
    }

    // Add place details with text
    let name = document.createElement('h1');
    name.classList.add('place');
    name.textContent = placeResult.name;
    infoPane.appendChild(name);
    if (placeResult.rating) {
        let rating = document.createElement('p');
        rating.classList.add('details');
        rating.textContent = `Rating: ${placeResult.rating} \u272e`;
        infoPane.appendChild(rating);
    }
    let address = document.createElement('p');
    address.classList.add('details');
    address.textContent = placeResult.formatted_address;
    infoPane.appendChild(address);
    if (placeResult.website) {
        let websitePara = document.createElement('p');
        let websiteLink = document.createElement('a');
        let websiteUrl = document.createTextNode(placeResult.website);
        websiteLink.appendChild(websiteUrl);
        websiteLink.title = placeResult.website;
        websiteLink.href = placeResult.website;
        websitePara.appendChild(websiteLink);
        infoPane.appendChild(websitePara);
    }


    // Open the infoPane
    infoPane.classList.add("open");

}

function deleteMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}