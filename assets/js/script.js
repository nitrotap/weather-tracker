/*
 * js file for weather tracker
 * // make another function - pass json data into it, parse the object
 * // 2api requests, but need to wait until first finishes, then
 *
 * todo add uv index background colors
 *

 */

let searchButtonEl = document.querySelector("#search-button");

searchButtonEl.addEventListener("click", function() {
    let cityInputEl = document.querySelector("#cityInput");
    let cityName = cityInputEl.value;

    if (cityName === "") {
        window.alert("Please Enter a City Name!")
    } else {
        let a = document.getElementById("forecast-card");
        if (a) {
            clearCards();
            console.log("hi")
        }
        geoLocateRequest(cityName);
    }



})


const clearCards = function() {
    // if cards exist, remove them
    // run this 5 times for cards
    for (let i = 0; i < 5 ; i++) {
        let a = document.getElementById("forecast-card");
        a.remove();
        console.log(a)
    }
}

const cityButtonList = function () {
    let cityList = JSON.parse(localStorage.getItem("cityList"));
    let cityButtonDivEl = document.querySelector("#city-list");


    if (cityList) {
        for (let i = 0; i < cityList.length; i++) {
            let cityButton = document.createElement("button");
            cityButton.textContent = cityList[i];
            cityButton.className = "city-button rounded"
            cityButtonDivEl.appendChild(cityButton);
            cityButton.addEventListener("click", function () {

                // let cityInputEl = document.querySelector("#cityInput");
                // let cityName = cityInputEl.value;

                let a = document.getElementById("forecast-card");
                if (a) {
                    clearCards();
                    console.log("hi")
                }
                geoLocateRequest(cityList[i]);

            })

        }
    }

}

const singleCityButton = function(cityName) {
    let cityButtonDivEl = document.querySelector("#city-list");

    let cityButton = document.createElement("button");

    cityButton.textContent = cityName;
    cityButton.className = "city-button rounded"

    cityButtonDivEl.appendChild(cityButton);
    cityButton.addEventListener("click", function () {
        geoLocateRequest(cityName);
    })
}



function cityStored(cityName) {
    let cityList = JSON.parse(localStorage.getItem("cityList"));
    if (cityList !== null) {
        let dupCheck = false;
        for (let i = 0; i < cityList.length; i++) {
            if (cityList[i] === cityName) {
                dupCheck = true;
            }
        }
        if (!dupCheck) {
            cityList.push(cityName);
            // todo add button logic
            // add single button to existing buttons
            singleCityButton(cityName);

        }
    } else {
        cityList = [];
        cityList.push(cityName)
    }
    localStorage.setItem("cityList", JSON.stringify(cityList))
}

// GeoLocation API
let geoLocateRequest = function(cityName) {
    let requestUrl =
        "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=63fc07461258d8d00c91ca3f94112536";
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

            cityStored(data[0].name);

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
    currentConditionsIconEl.src = "https://openweathermap.org/img/wn/" +iconId+"@2x.png"
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
    if (data.current.uvi <= 2) {
        currentConditionsUVEl.className = "bg-success text-light";
    } else if (data.current.uvi > 2 && data.current.uvi < 8) {
        currentConditionsUVEl.className ="bg-warning";
    } else {
        currentConditionsUVEl.className = "bg-danger text-light";
    }

}

const fiveDayForecast = function(data) {
    // start with tomorrow
    console.log(data)
    for (let i = 1; i < 6; i++) {
        // let futureDayEl = document.querySelector("#day1")
        // consists of date, icon, temp, wind, humidity
        // instead of current, it uses daily[0] - today, daily[1] is tomorrow
        let futureDayEl = document.createElement("div");
        // futureDayEl.className = "col-2 bg-dark text-light"
        futureDayEl.className = "col-12 col-sm-5 col-lg-2 bg-dark text-light"

        futureDayEl.id = "forecast-card";

        // date element
        let date = new Date(data.daily[i].dt * 1000);
        let formattedDate = date.toLocaleDateString();
        let dateEl = document.createElement("h5");
        dateEl.textContent = formattedDate;
        futureDayEl.appendChild(dateEl);

        // icon element
        let futureIconEl = document.createElement("img")

        let iconId = data.daily[i].weather[0].icon;
        futureIconEl.src = "https://openweathermap.org/img/wn/" + iconId + "@2x.png"
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

// on load
cityButtonList();
geoLocateRequest("Denver");

