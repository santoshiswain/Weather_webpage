
let btn = document.querySelector(".a");

const apikey = "3895e1647f2076b1f02a1f9d3002f20c";
const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

btn.addEventListener("click", async function() {

    let res = await checkbox();

    if (!res) return;

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
});

document.getElementById("city").addEventListener(
    "keypress",
    function(event) {
        if (event.key === "Enter") {
            btn.click();
        }
    }
);

async function checkbox() {

    let city = document.getElementById("city").value.trim();

    if (!city) {
        alert("Please enter a city name");
        return null;
    }

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

        const forecast = Object.values(dailyData)
            .slice(0, 5);

        const dates = Object.keys(dailyData).slice(0, 5);

        const forecastContainer =
            document.getElementById("forecast");

        forecastContainer.innerHTML = "";

       forecast.forEach((day, index) => {

            // Select the forecast closest to 12 PM
            const selected = day.entries.reduce((best, item) => {

                const hour = Number(item.dt_txt.split(" ")[1].slice(0, 2));

           const bestHour = Number(best.dt_txt.split(" ")[1].slice(0, 2));

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

    } catch (error) {

        document.getElementById("forecast").innerHTML =
      "<p>Unable to load forecast.</p>";

        console.error(error);

    }
}

