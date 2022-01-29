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

            let cityNameEl = document.querySelector("#cityName");
            cityNameEl.textContent = data[0].name;

            fetchCityWeather(data);


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

            fiveDayForecast(data);



        }).catch(function (error) {
        console.log(error);
    });

}


const currentForecast = function (data) {
    // date element
    let date = new Date(data.current.dt * 1000);
    let formattedDate = date.toLocaleDateString();
    // console.log(formattedDate)
    let currentConditionsDateEl = document.querySelector("#currentDate");
    currentConditionsDateEl.textContent = formattedDate;

    // icon element
    let currentConditionsIconEl = document.querySelector("#currentIcon");
    let iconId = data.current.weather[0].icon;
    currentConditionsIconEl.src = "http://openweathermap.org/img/wn/" +iconId+"@2x.png"
    currentConditionsIconEl.className = "currentIcon";
    
    // weather description element
    let currentConditionsStatusEl = document.querySelector("#weatherDesc");
    currentConditionsStatusEl.textContent = data.current.weather[0].description;
    currentConditionsStatusEl.className = "text-center"
    
    // temperature element
    let currentConditionsTempEl = document.querySelector("#currentTemp");
    let tempF = data.current.temp;
    currentConditionsTempEl.textContent = "Temp: " + Math.round((tempF*100)/100) + "°F";
    // currentConditionsTempEl.className = "d-flex justify-content-start";
    
    // wind element
    let currentConditionsWindEl = document.querySelector("#currentWind")
    let windSpeed = data.current.wind_speed;
    // console.log(windSpeed);
    currentConditionsWindEl.textContent = "Wind Speed: " + windSpeed + " mph";

    // humidity element
    let currentConditionsHumidityEl = document.querySelector("#currentHumid");
    currentConditionsHumidityEl.textContent = "Humidity: " + data.current.humidity + "%";
    // console.log(data.current.humidity)

    // uv element
    let currentConditionsUVEl = document.querySelector("#currentUV");
    currentConditionsUVEl.textContent = "UV Index: " + data.current.uvi;

}

const fiveDayForecast = function(data) {
    // start with tomorrow
    console.log(data)
    let i = 1;
    for (let i = 1; i < 6; i++) {
        // let futureDayEl = document.querySelector("#day1")
        // consists of date, icon, temp, wind, humidity
        // instead of current, it uses daily[0] - today, daily[1] is tomorrow
        let futureDayEl = document.createElement("div");
        futureDayEl.className = "col-2";

        // date element
        let date = new Date(data.daily[i].dt * 1000);
        let formattedDate = date.toLocaleDateString();
        let dateEl = document.createElement("h4")
        dateEl.textContent = formattedDate;
        futureDayEl.appendChild(dateEl);

        // icon element
        let futureIconEl = document.createElement("img")

        let iconId = data.daily[i].weather[0].icon;
        futureIconEl.src = "http://openweathermap.org/img/wn/" + iconId + "@2x.png"
        futureIconEl.className = "currentIcon";

        futureDayEl.appendChild(futureIconEl)

        let futureTempEl = document.createElement("p")
        let tempF = data.daily[i].temp.day;
        futureTempEl.textContent = "Temp: " + Math.round((tempF * 100) / 100) + "°F";
        futureDayEl.appendChild(futureTempEl)

        let futureWindEl = document.createElement("p")
        let windSpeed = data.daily[i].wind_speed;
        futureWindEl.textContent = "Wind Speed: " + windSpeed + " mph";
        futureDayEl.appendChild(futureWindEl)


        let futureHumEl = document.createElement("p")
        futureHumEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
        futureDayEl.appendChild(futureHumEl)


        let futureRow = document.querySelector("#forecast-row");
        futureRow.className = "row d-flex justify-content-between"
        futureRow.appendChild(futureDayEl);
    }

}


