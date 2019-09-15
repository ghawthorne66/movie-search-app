$(document).ready(function(){
    $("#submit").on("click", function(event){
        event.preventDefault();

        // Retrieves value user inputs
        var movieTitle = $("#movie-input").val().trim();

        // Clears out input box
        $("#movie-input").empty();

        // Creates query URL based off of user's input
        var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=" + movieTitle + " trailer&key=AIzaSyANwe_R8GJEK-5rYI2aufq2Gh2HZjQcOJI";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            // If the query returned at least one item
            if (response.items.length > 0){
                // Create and store reference to new iframe element
                var trailer = $("<iframe>").addClass("embed-responsive-item pr-3");
                // Changes source to the link to the first response item
                trailer.attr("src", "https://www.youtube.com/embed/" + response.items[0].id.videoId);
                // Appends trailer to trailer div
                $("#trailer").append(trailer);
            }

        })

    })
})