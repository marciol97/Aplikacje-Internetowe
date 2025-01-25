const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.resultsBlock = document.querySelector(resultsBlockSelector);
    }

    getCurrentWeather(query) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&lang=pl&appid=${this.apiKey}`;

            xhr.open("GET", url);
            xhr.onload = () => {
                if (xhr.status === 200) {
                    console.log("Response from Current Weather API:", xhr.responseText);
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(`Error: ${xhr.status} - ${xhr.statusText}`);
                }
            };
            xhr.onerror = () => reject("Network error occurred");
            xhr.send();
        });
    }

    async getForecast(query) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(query)}&units=metric&lang=pl&appid=${this.apiKey}`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log("Response from 5 Day Forecast API:", data);
            return data;

        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    }

    async getWeather(query) {
        try {
            this.clearResults();
            const currentWeather = await this.getCurrentWeather(query);
            const forecast = await this.getForecast(query);

            this.drawWeather(currentWeather, forecast);
        } catch (error) {
            this.resultsBlock.innerHTML = `<div class="error">${error}</div>`;
        }
    }

    clearResults() {
        this.resultsBlock.innerHTML = "";
    }

    drawWeather(currentWeather, forecast) {
        const currentBlock = this.createWeatherBlock(
            new Date(currentWeather.dt * 1000).toLocaleString(),
            currentWeather.main.temp,
            currentWeather.main.feels_like,
            currentWeather.weather[0].icon,
            currentWeather.weather[0].description
        );

        this.resultsBlock.appendChild(currentBlock);

        forecast.list.slice(0, 5).forEach(entry => {
            const forecastBlock = this.createWeatherBlock(
                new Date(entry.dt * 1000).toLocaleString(),
                entry.main.temp,
                entry.main.feels_like,
                entry.weather[0].icon,
                entry.weather[0].description
            );
            this.resultsBlock.appendChild(forecastBlock);
        });
    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        const block = document.createElement("div");
        block.classList.add("weather-block");

        block.innerHTML = `
            <div class="weather-date">${dateString}</div>
            <div class="weather-temperature">${temperature.toFixed(2)} &deg;C</div>
            <div class="weather-temperature-feels-like">Odczuwalna: ${feelsLikeTemperature.toFixed(2)} &deg;C</div>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${iconName}@2x.png" alt="${description}">
            <div class="weather-description">${description}</div>
        `;

        return block;
    }
};

document.weatherApp = new WeatherApp("d898966bfd366d53145fe245916b449f", "#weather-results-container");

document.querySelector("#checkButton").addEventListener("click", function() {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});
