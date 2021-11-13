//vars for search info
searchEntry = $("#input");
searchBtnEl = $("#searchBtn")

//sets an empty array
var searchHistory = [];


// date display handler
var dateDisplayHandler = function () {
    // current day
    var currentDay = moment().format("ddd M/DD/YYYY");
    $("#currentDate").text("("+currentDay+")");

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

//search button event listener
searchEntry.keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        searchBtnEl.click();
    }
})

$('#searchHistoryContainer').on('click', "button", function(event) {
    var cityName = event.target.innerText;
    geocode(cityName)
})

var geocode = function(cityName) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=cccf269a77ddb6c94abd87b983498833";

    fetch(apiUrl).then(function(res) {
        if (res.ok) {
            res.json().then(function(res) {
                console.log(res);

                //city name and display
                var cityName = res[0].name;
                $('#city').text(cityName);

                //save to local storage
                saveSearch(cityName);

                //grab lat/lon and send to fetcher function
                // var lat = res[0].lat
                // var lon = res[0].lon
                // fetcher(lat, lon);

                //load local storage
                loadHistory()
            })
        }
    })
}


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
                $("#currentIcon").attr("src", iconUrl);
                
                // grab temp
                var temp = response.current.temp + " °F";
                $("#currentTemp").text(temp);
                
                // grab wind
                var wind = response.current.wind_speed + " MPH";
                $("#currentWind").text(wind);
                
                // grab humidity
                var humidity = response.current.humidity + "%";
                $("#currentHumidity").text(humidity);
                
                // grab uvi
                var uvi = response.current.uvi;
                $("#currentUV").text(uvi);
                // set uvi color
                if (uvi >= 0 && uvi <= 2) {
                    $("#currentUV").removeClass()
                    $("#currentUV").addClass("uv-favorable")
                } else if (uvi > 2 && uvi <= 7) {
                    $("#currentUV").removeClass()
                    $("#currentUV").addClass("uv-moderate")
                } else {
                    $("#currentUV").removeClass()
                    $("#currentUV").addClass("uv-severe")
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





//search button click listener
searchBtnEl.click(function() {
    var searchEntry = $("#input").val().trim();
    console.log(searchEntry + ' was searched.');
})

//save search to local storge
var saveSearch = function(cityName) {
    searchHistory.push(cityName);

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

var loadHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem('searchHistroy'));

    if (!searchHistory) {
        searchHistory = []
    }

    //clear old buttons
    $('#searchHistoryContainer').htlm('')
    //create array to delete duplicates
    const uniqueSearchHistory = [...new Set(searchHistory)];

    //for loop to create buttons from last 7 searches
    for(var i = uniqueSearchHistory.length - 1; i>= uniqueSearchHistory.length - 7; i--) {
        
        if (uniqueSearchHistory[i]) {
            var cityName = uniqueSearchHistory[i];
            $("<button class='historyText ml-2 mb-1'> "+cityName+" </button>").appendTo("searchHistory");
            console.log('button created')
        }
    }
}





setInterval(dateDisplayHandler, 3600000);
dateDisplayHandler();