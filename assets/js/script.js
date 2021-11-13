// dom elements
var searchBtnEl = $("#search-btn");
var searchEntry = $("#input");

// saved searches array
var searchHistory = [];

// date display handler
var dateDisplayHandler = function () {
    // current day
    var currentDay = moment().format("ddd M/DD/YYYY");
    $("#current-date").text("("+currentDay+")");

    // tomorrow
    var day1 = moment().add("day", 1).format("ddd M/DD/YYYY");
    $("#date-1").text(day1);
    
    // day after tomorrow
    var day2 = moment().add("day", 2).format("ddd M/DD/YYYY");
    $("#date-2").text(day2);

    // 3 days from now
    var day3 = moment().add("day", 3).format("ddd M/DD/YYYY");
    $("#date-3").text(day3);

    // 4 days from now
    var day4 = moment().add("day", 4).format("ddd M/DD/YYYY");
    $("#date-4").text(day4);

    // 5 days from now
    var day5 = moment().add("day", 5).format("ddd M/DD/YYYY");
    $("#date-5").text(day5);
}

// search button 'enter' listener
searchEntry.keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        searchBtnEl.click();
    }
})

// search button click listener
searchBtnEl.click(function() {
    // grab value
    var searchEntry = $("#input").val().trim();
    
    console.log(searchEntry + " was searched.");
    
    // send to geocoding function
    geocode(searchEntry);
    
    $("#input").val("");
})

// search history button click listener
$("#search-history-container").on("click", "button", function(event) {
    var cityName = event.target.innerText;

    // send to geocoding function
    geocode(cityName);
})

// geocode users search to get lat/lon for api call
var geocode = function(cityName) {
    // set url
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=cccf269a77ddb6c94abd87b983498833";
    
    // fetch geocode info
    fetch(apiUrl).then(function(repsonse) {
        if (repsonse.ok) {
            repsonse.json().then(function(response) {
                console.log(response);
                
                // grab city name and display
                var cityName = response[0].name;
                $("#city").text(cityName);
                
                // save to local data for history
                saveSearch(cityName);
                
                // grab lat/lon and send to fetcher
                var lat = response[0].lat
                var lon = response[0].lon
                fetcher(lat, lon);

                // load history and update with new button
                loadHistory();
            })
        }
    })
} 

// function to fetch and parse api
var fetcher = function(lat, lon) {
    // set url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=cccf269a77ddb6c94abd87b983498833"
    
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(response) {
                console.log(response);
                
                // grab weather icon
                var weatherIcon = response.current.weather[0].icon;
                var iconUrl = "http://openweathermap.org/img/wn/"+weatherIcon+"@2x.png"
                $("#current-icon").attr("src", iconUrl);
                
                // grab temp
                var temp = response.current.temp + " °F";
                $("#current-temp").text(temp);
                
                // grab wind
                var wind = response.current.wind_speed + " MPH";
                $("#current-wind").text(wind);
                
                // grab humidity
                var humidity = response.current.humidity + "%";
                $("#current-humidity").text(humidity);
                
                // grab uvi
                var uvi = response.current.uvi;
                $("#current-uv").text(uvi);
                // set uvi color
                if (uvi >= 0 && uvi <= 2) {
                    $("#current-uv").removeClass()
                    $("#current-uv").addClass("uv-favorable")
                } else if (uvi > 2 && uvi <= 7) {
                    $("#current-uv").removeClass()
                    $("#current-uv").addClass("uv-moderate")
                } else {
                    $("#current-uv").removeClass()
                    $("#current-uv").addClass("uv-severe")
                }
                
                // loop through daily key and grab/display data
                for (var i = 0; i < 5; i++) {
                    // weather icon
                    var weatherIcon = response.daily[i].weather[0].icon;
                    var iconUrl = "http://openweathermap.org/img/wn/"+weatherIcon+"@2x.png"
                    $("#icon-" + (i + 1)).attr("src", iconUrl);
                    
                    // temp
                    var temp = response.daily[i].temp.max + " °F";
                    $("#temp-" + (i + 1)).text(temp);
                    
                    // wind
                    var wind = response.daily[i].wind_speed + " MPH";
                    $("#wind-" + (i + 1)).text(wind);
                    
                    // grab humidity
                    var humidity = response.daily[i].humidity + "%";
                    $("#humidity-" + (i + 1)).text(humidity);
                }
            })
        }
    })
}

// save search to localstorage
var saveSearch = function(cityName) {
    // push to array
    searchHistory.push(cityName);
    
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

var loadHistory = function() {
    // grab from local storage
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

    if (!searchHistory) {
        searchHistory = [];
    }

    // clear old buttons
    $("#search-history-container").html("");

    // create unique array to clear duplicate entries
    const uniqueSearchHistory = [...new Set(searchHistory)];

    // loop through and create buttons from the last 7 searched cities
    for (var i = uniqueSearchHistory.length-1; i >= uniqueSearchHistory.length-7; i--) {

        // check for undefined/empty slots
        if (uniqueSearchHistory[i]) {
            // create new buttons
            var cityName = uniqueSearchHistory[i];
            $("<button class='btn' type='button'>"+cityName+"</button>").appendTo("#search-history-container");
        }
    }
}

setInterval(dateDisplayHandler, 3600000);

dateDisplayHandler();

loadHistory();