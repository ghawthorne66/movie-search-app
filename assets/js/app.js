
// displayMovieInfo function re-renders the HTML to display the appropriate content
$(document).ready(function () {
    $("#submit").on("click", function(event){
        event.preventDefault();

        var movie = $("#movie-input").val().trim();
        $("#movie-input").text("");

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
    
            // Youtube Trailer query
            var youtubeQueryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=" + movie + " trailer&key=AIzaSyANwe_R8GJEK-5rYI2aufq2Gh2HZjQcOJI";
            
            $.ajax({
                url: youtubeQueryURL,
                method: "GET"
            }).then(function(response){
                console.log(response);

                // Clears out current placeholder trailer
                $("#trailer").empty();

                // Adds trailer to page
                var trailer = $("<iframe>").addClass("embed-responsive-item pr-3");
                trailer.attr("src", "https://www.youtube.com/embed/" + response.items[0].id.videoId);
                $("#trailer").append(trailer);
            })
        });


    })
})

//---------GOOGLE MAPS---------//

    let pos;
    let map;
    let bounds;
    let infoWindow;
    let currentInfoWindow;
    let service;
    let infoPane;
    function initMap() {
      // Initialize variables
      bounds = new google.maps.LatLngBounds();
      infoWindow = new google.maps.InfoWindow;
      currentInfoWindow = infoWindow;

      infoPane = document.getElementById('panel');

      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 5
        });
      }

      // Try HTML5 geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map = new google.maps.Map(document.getElementById('map'), {
            center: pos,
            zoom: 2
          });
          bounds.extend(pos);

          infoWindow.setPosition(pos);
          infoWindow.setContent('Location found.');
          infoWindow.open(map);
          map.setCenter(pos);

          // Call Places Nearby Search on user's location
          getNearbyPlaces(pos);
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
      getNearbyPlaces(pos);
    }

    // Perform a Places Nearby Search Request
    function getNearbyPlaces(position) {
      let request = {
        location: position,
        rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: 'movie-theater'
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, nearbyCallback);
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
        let marker = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name
        });

        // Add click listener to each marker
        google.maps.event.addListener(marker, 'click', () => {
          let request = {
            placeId: place.place_id,
            fields: ['name', 'formatted_address', 'geometry', 'rating',
              'website', 'photos']
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
//---------------------END GOOGLE MAPS------------------------//
