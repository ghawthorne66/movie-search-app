  //----------GRACENOTE API REQUEST--------------

    // Creating an AJAX call for the specific movie button being clicked


    var gracenoteQueryURL = "http://data.tmsapi.com/v1.1/movies/showings?startDate=2019-09-16&zip=78701&lat=32.7157%C2%B0&lng=117.1611&radius=99&units=mi&imageText=true" + "inception" + "&api_key=fu4n5h6x7xfmhq96e8zg8gnn";

    // Creating an AJAX call for the specific movie button being clicked
    $.ajax({
      url: gracenoteQueryURL,
      method: "GET"
  }).then(function (response) {
      console.log(response[0].showtimes[0]);


      //Title, Director, Genre, Plot, Poster, Rated, Released, Year, Runtime
      var director = response.Director;
      $("#movie-director").text(director);

      var rating = response.Rated;
      $("#movie-rated").text(rating);
  })
  