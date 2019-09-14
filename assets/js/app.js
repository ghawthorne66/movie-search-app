  // displayMovieInfo function re-renders the HTML to display the appropriate content
  function displayMovieInfo() {

      var movie = $(this).attr("data-name");
      var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";

      // Creating an AJAX call for the specific movie button being clicked
      $.ajax({
              url: queryURL,
              method: "GET"
          }).then(function (response) {
                  console.log(response);

                  //Title, Director, Genre, Plot, Poster, Rated, Released, Website, Year, Runtime

                  // Creating a div to hold the movie
                  var movieDiv = $("<div class='movie'>");
                  // group project 
                  var Director = response.Director
                  var pDirector = $("<p>").text("Director: " + Director);
                  movieDiv.append(pDirector)
                 console.log ("Director");
                 
                  var rating = response.Rated;
                  var pRating = $("<p>").text("rating: " + rating);
                  movieDiv.append(pRating);

                  var title = response.Title
                  var pTitle = $("<p>").text("title: " + title);
                  movieDiv.append(pTitle)


                  var genre = response.Genre
                  var pGenre = $("<p>").text("Genre: " + genre);
                  movieDiv.append(pGenre)

                  var plot = response.Plot
                  var pPlot = $("<p>").text("Plot: " + plot);
                  movieDiv.append(pPlot)

                  var imgURL = response.Poster
                  var image = $("<img>").attr("src", imgURL);
                  movieDiv.append(image);

                  var rated = response.Rated
                  var pRated = $("<p>").text("Rated: " + rated);
                  movieDiv.append(pRated);

                  var released = response.Released
                  var pReleased = $("<p>").text("Released: " + released);
                  movieDiv.append(pReleased);

                  var year = response.Year
                  var pYear = $("<p>").text("Year: " + year);
                  movieDiv.append(pYear);

                  var runtime = response.Runtime
                  var pRuntime = $("<p>").text("Runtime: " + runtime);
                  movieDiv.append(pRuntime);
                });
            

            }
            displayMovieInfo();
