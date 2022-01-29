/*
 * js file for weather tracker
 * // make another function - pass json data into it, parse the object
 * // 2api requests, but need to wait until first finishes, then
 *
 * TODO make icon function makeIcon(weatherdata)
 * todo make single day forecast function
 * todo make city buttons list
 * todo add uv index background colors
 *


 */

let searchButtonEl = document.querySelector("#search-button");

searchButtonEl.addEventListener("click", function() {
    let cityInputEl = document.querySelector("#cityInput");
    let cityName = cityInputEl.value;
    geoLocateRequest(cityName);


})


let city;

// GeoLocation API
let geoLocateRequest = function(cityName) {
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
            // fetchCityWeather(data);
            // console.log(data)

            let cityDivEl = document.querySelector("#current");
            let cityNameEl = document.createElement("h2")
            cityNameEl.className = "d-flex justify-content-center align-items-center"
            cityNameEl.textContent = data[0].name;
            cityDivEl.appendChild(cityNameEl)

            fetchCityWeather(data)


        }).catch(function (error) {
        console.log(error);
    });
}

const fetchCityWeather = function(data) {
    let requestUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" + data[0].lat +
        "&lon="+ data[0].lon + "&units=imperial&appid=63fc07461258d8d00c91ca3f94112536";
    fetch(requestUrl)
        .then(function(response) { // response is an HTTP response that needs to be converted into JSON
            if (response.status !== 200) {  // if you get a status code of not 200 (status OK)
                document.location.replace('./404.html'); // then replace with 404 page
            } else {
                return response.json(); // returns JSON
            }})
        .then(function(data) {
            // displaying the data - a new function that shows forecast
            // invoke the show forecast function
            // need the onecall response as json
            // console.log(data)
            currentForecast(data);




        }).catch(function (error) {
        console.log(error);
    });

}


const currentForecast = function (data) {

    let currentConditionsEl = document.querySelector("#current")
    let currentConditionsDivEl = document.createElement("div");


    let currentConditionsDateIconDivEl = document.createElement("div");
    currentConditionsDateIconDivEl.className = "d-flex align-items-center justify-content-center"

    let date = new Date(data.current.dt * 1000);
    let formattedDate = date.toLocaleDateString();
    // console.log(formattedDate)
    let currentConditionsDateEl = document.createElement("h3");
    currentConditionsDateEl.textContent = formattedDate;
    currentConditionsDateIconDivEl.appendChild(currentConditionsDateEl);

    let currentConditionsIconEl = document.createElement("img");
    let iconStatus = iconCurrentGenerator(data);
    currentConditionsIconEl.src = "http://openweathermap.org/img/wn/" +iconStatus+"@2x.png"
    currentConditionsIconEl.className = "currentIcon";
    currentConditionsDateIconDivEl.appendChild(currentConditionsIconEl);

    let currentConditionsStatusEl = document.createElement("h4");
    currentConditionsStatusEl.textContent = data.current.weather[0].description;
    currentConditionsDateIconDivEl.appendChild(currentConditionsStatusEl);

    currentConditionsDivEl.appendChild(currentConditionsDateIconDivEl);

    let currentConditionsTempEl = document.createElement("p");
    let tempF = data.current.temp;
    currentConditionsTempEl.textContent = "Temp: " + Math.round((tempF*100)/100) + "°F";
    currentConditionsDivEl.appendChild(currentConditionsTempEl);

    let currentConditionsWindEl = document.createElement("p")
    let windSpeed = data.current.wind_speed;
    // console.log(windSpeed);
    currentConditionsWindEl.textContent = "Wind Speed: " + windSpeed + " mph";
    currentConditionsDivEl.appendChild(currentConditionsWindEl);

    let currentConditionsHumidityEl = document.createElement("p");
    currentConditionsHumidityEl.textContent = "Humidity: " + data.current.humidity + "%";
    // console.log(data.current.humidity)
    currentConditionsDivEl.appendChild(currentConditionsHumidityEl)

    let currentConditionsUVEl = document.createElement("p");
    currentConditionsUVEl.textContent = "UV Index: " + data.current.uvi;
    currentConditionsDivEl.appendChild(currentConditionsUVEl);
    /*
        console.log(data.current.weather[0].main) // weather status
        let currentConditions = data.current.weather[0].main;
     */
    currentConditionsEl.appendChild(currentConditionsDivEl);
}


const iconCurrentGenerator = function(data) {
    console.log(data)
    // parse data for icon id
    let iconId = data.current.weather[0].icon;
    console.log(iconId)
    return iconId;
}

const fiveDayForecast = function(data) {

}