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

