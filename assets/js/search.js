/*
 * js file for location search bar
 *
 */

let searchButtonEl = document.querySelector("#search-button");

searchButtonEl.addEventListener("click", function() {
    let cityInputEl = document.querySelector("#cityInput");
    let cityName = cityInputEl.value;
    searchCityRequest(cityName);


})


let city;


let searchCityRequest = function(cityName) {
    let requestUrl =
        "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=63fc07461258d8d00c91ca3f94112536";
    fetch(requestUrl)
        .then(function (response) { // response is an HTTP response that needs to be converted into JSON
            if (response.status !== 200) {  // if you get a status code of not 200 (status OK)
                document.location.replace('./404.html'); // then replace with 404 page
            } else {
                return response.json(); // returns JSON
            }
        })
        .then(function (data) {
            // pass data into function parsing the data
            /*
            console.log(data)
            console.log(data[0].name)
            console.log(data[0].lat)
            console.log(data[0].lon)*/

            // make another function - pass json data into it, parse the object
            // 2api requetss, but need to wait until first finishes, then

            city = {
                name: data[0].name,
                lat: data[0].lat,
                lon: data[0].lon
            };
            console.log(city); // this object is only loading AFTER the fetch

            fetchCityWeather(city.lat, city.lon);
            // once all data
            fetchCityWeather(data);
        }).catch(function (error) {
            console.log(error);
    });
}

const fetchCityWeather = function(lat, lon) {
    let requestUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +
        "&lon="+ lon + "&appid=63fc07461258d8d00c91ca3f94112536";
    fetch(requestUrl)
        .then(function(response) { // response is an HTTP response that needs to be converted into JSON
            if (response.status !== 200) {  // if you get a status code of not 200 (status OK)
                document.location.replace('./404.html'); // then replace with 404 page
            } else {
                return response.json; // returns JSON
            }})
        .then(function(data) {
            console.log(data);
            // displaying the data - a new function that shows forecast
            // invoke the show forecast function
        }).catch(function (error) {
        console.log(error);
    });

}