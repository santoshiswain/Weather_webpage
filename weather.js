
let btn = document.querySelector(".a");
let gpsBtn = document.getElementById("gps-btn");

const apikey = "3895e1647f2076b1f02a1f9d3002f20c";
const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

// SEARCH BUTTON
btn.addEventListener("click", async function() {

    let res = await checkbox();

    if (!res) return;

    displayWeather(res);

});

// ENTER KEY
document.getElementById("city").addEventListener(
    "keypress",
    function(event) {

        if (event.key === "Enter") {
            btn.click();
        }

    }
);


// DISPLAY WEATHER
function displayWeather(res) {

    document.getElementById("result").innerHTML =
        res.main.temp + "°C";

    document.getElementById("sita").innerHTML =
        res.main.humidity + "%";

    document.getElementById("ram").innerHTML =
        res.wind.speed + " km/hr";

    document.getElementById("city-name").innerText =
        res.name;

    getForecast(res.name);

    let condition = res.weather[0].main.toLowerCase();

    document.body.className = "";

    if (condition === "clear") {
        document.body.classList.add("weather-clear");
    }
    else if (condition === "clouds") {
        document.body.classList.add("weather-clouds");
    }
    else if (condition === "rain") {
        document.body.classList.add("weather-rain");
    }
    else if (condition === "snow") {
        document.body.classList.add("weather-snow");
    }
    else {
        document.body.classList.add("weather-mist");
    }

}


// CITY SEARCH FUNCTION
async function checkbox() {

    let city = document.getElementById("city").value.trim();

    if (!city) {
        alert("Please enter a city name");
        return null;
    }

    try {

        const response = await fetch(
            `${url}${encodeURIComponent(city)}&appid=${apikey}`
        );

        const data = await response.json();

        if (response.ok && data.cod == 200) {
            return data;
        }
        else {
            alert("City not found!");
            return null;
        }

    }
    catch (error) {

        alert("Unable to connect. Check your internet connection.");
        return null;

    }

}


// LIVE GPS FUNCTION
gpsBtn.addEventListener("click", function() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported by your browser.");
        return;

    }

    gpsBtn.disabled = true;
    gpsBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

    navigator.geolocation.getCurrentPosition(

        async function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            try {

                const gpsUrl =
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`;

                const response = await fetch(gpsUrl);

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Weather not available");
                }

                // Display current location weather
                displayWeather(data);

                // Show detected city in search box
                document.getElementById("city").value = data.name;

            }
            catch (error) {

                alert("Unable to get weather for your location.");

                console.error(error);

            }
            finally {

                gpsBtn.disabled = false;
                gpsBtn.innerHTML =
                    '<i class="fa-solid fa-location-crosshairs"></i>';

            }

        },

        function(error) {

            gpsBtn.disabled = false;

            gpsBtn.innerHTML =
                '<i class="fa-solid fa-location-crosshairs"></i>';

            if (error.code === 1) {
                alert("Location permission denied. Please allow location access.");
            }
            else if (error.code === 2) {
                alert("Your location is unavailable. Please try again.");
            }
            else if (error.code === 3) {
                alert("Location request timed out. Please try again.");
            }
            else {
                alert("Unable to access your current location.");
            }

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );

});


// 5-DAY FORECAST
async function getForecast(city) {

    const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apikey}&units=metric`;

    try {

        const response = await fetch(forecastUrl);

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Forecast not available");
        }

        const dailyData = {};

        data.list.forEach(item => {

            let date = item.dt_txt.split(" ")[0];

            if (!dailyData[date]) {

                dailyData[date] = {
                    temps: [],
                    entries: []
                };

            }

            dailyData[date].temps.push(item.main.temp);
            dailyData[date].entries.push(item);

        });

        const forecast = Object.values(dailyData).slice(0, 5);

        const dates = Object.keys(dailyData).slice(0, 5);

        const forecastContainer =
            document.getElementById("forecast");

        forecastContainer.innerHTML = "";

        forecast.forEach((day, index) => {

            // Select forecast closest to 12 PM
            const selected = day.entries.reduce((best, item) => {

                const hour = Number(
                    item.dt_txt.split(" ")[1].slice(0, 2)
                );

                const bestHour = Number(
                    best.dt_txt.split(" ")[1].slice(0, 2)
                );

                return Math.abs(hour - 12) < Math.abs(bestHour - 12)
                    ? item : best;

            });

            const condition = selected.weather[0].main;

            let icon = "clear.png";

            if (condition === "Clouds") icon = "clouds.png";
            else if (condition === "Rain") icon = "rain.png";
            else if (condition === "Drizzle") icon = "drizzle.png";
            else if (condition === "Snow") icon = "snow.png";

            const date = new Date(dates[index]);

            const dayName = date.toLocaleDateString("en-US", {
                weekday: "short"
            });

            const maxTemp = Math.round(Math.max(...day.temps));
            const minTemp = Math.round(Math.min(...day.temps));

            forecastContainer.innerHTML += `

                <div class="forecast-card">

                    <h3>${dayName}</h3>

                    <img src="${icon}" alt="${condition}">

                    <p>${condition}</p>

                    <h3>${Math.round(selected.main.temp)}°C</h3>

                    <p>H: ${maxTemp}°</p>

                    <p>L: ${minTemp}°</p>

                </div>

            `;

        });

    }
    catch (error) {

        document.getElementById("forecast").innerHTML =
            "<p>Unable to load forecast.</p>";

        console.error(error);

    }

}




