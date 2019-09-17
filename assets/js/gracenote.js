
//Create an event listener to search movie by title

var movieName;

var moviesAndRootIDs = [];

$("#submit").on('click', function(){
 movieName = $("#movie-input").val().trim;
 alert('you clicked me!');
 console.log(movieName)
 
})


// Creating an AJAX call for the specific movie button being clicked



var gracenoteQueryURL = "http://data.tmsapi.com/v1.1/movies/showings?startDate=2019-09-17&zip=92101&lat=32.7157&lng=-117.1611&radius=100&units=mi&imageSize=Md&imageText=true&api_key=ggxa8rz4a4a3sxvsf5xggtu5";
console.log(gracenoteQueryURL);
  //create an event that when clicked will search zip code
  //display title, theatre, showtimes

//array = [{
   // movieName: tmsID

//}]

   var theatreNameArray = [];

// Creating an AJAX call for the specific movie button being clicked
$.ajax({
  url: gracenoteQueryURL,
  method: "GET"
}).then(function(response) {
  console.log(response);


  for (var i = 0; i < response.length; i++) {
    var movieTitle = response[i].title;
    var movieRootID = response[i].rootId;
  
    var tempObj = {};
    tempObj[movieTitle] = movieRootID;

    moviesAndRootIDs.push(tempObj);

  }
  


  console.log(moviesAndRootIDs);

  
  // create an element to hold the text
  // append that element to the page

  //  $(document).ready(function () {
  //movie, theatre name and place,showtimes;

   var showtimeRow = response.showtimes;
  $("#movie-showtimeRow").text(showtimeRow);
  

  // loop through the response, limit to 5 results 
  for (i = 0; i < response.length; i++) {
    // create an element to hold the theater name

    var newArrItem = response[i].showtimes[0].theatre.name

    if (theatreNameArray.indexOf(newArrItem) === -1) {
        theatreNameArray.push(newArrItem)

    }

    // console.log(theatreNameArray);
    var theatreElement = $("<p>");
    // set the text of that element = the theater name 
    // theatreElement.text(response[i].showtimes[0].theatre.name)
    // append that element to the page 
    // $("#theatre-display").append(theatreElement);

    // showtimeObject = response[i].showtimes;

    // for (j = 0; j < showtimeObject.length; j++) {
    //   var theatre = $("<td>").text(showtimeObject[i].theatre.name);

    //   showtimeRow.text(theatre);
    //   datetime = $("<td>").text(showtimeObject[i].dateTime);
    //   showtimeRow.append(datetime);

    //   $("#time-table").append(text);
    // }
  }
}, function(error) {
  console.log(error);
})
