//vars for search info
searchEntry = $("#input");
searchBtnEl = $("#searchBtn")


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

//search button click listener
searchBtnEl.click(function() {
    var searchEntry = $("#input").val().trim();
    console.log(searchEntry + ' was searched.');
})







setInterval(dateDisplayHandler, 3600000);
dateDisplayHandler();