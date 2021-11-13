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
}





setInterval(dateDisplayHandler, 3600000);
dateDisplayHandler();