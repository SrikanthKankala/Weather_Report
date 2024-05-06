
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour;
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`;

    dateEl.innerHTML = days[day] + ' ' + date+ ' ' + months[month];

}, 1000);

const apiKey = "49cc8c821cd2aff9af04c9f98c36eb74"; // Replace with your actual OpenWeatherMap API key
const baseUrl = "https://api.openweathermap.org/data/2.5/forecast";
let city = "Delhi";   //Replace city
const topDayElement = document.getElementById('top-day');
const horizontalDaysContainer = document.getElementById('horizontal-days-container');
const cityInput = document.getElementById('cityInput');

function getWeatherData() {
    const endpoint = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`;
    fetch(endpoint)
        .then(response => response.json())
        .then(data => updateWeather(data));
}

function updateWeather(data) {
    const currentDayIndex = new Date().getDay();
    const temperature = data.list[currentDayIndex].main.temp;
    const condition = data.list[currentDayIndex].weather[0].description;
    const iconCode = data.list[currentDayIndex].weather[0].icon;

    topDayElement.innerHTML = `
        <div id="${days[currentDayIndex]}" class="day">
            <h2>${days[currentDayIndex]}</h2>
            <p class="temperature">${temperature}°C</p>
            <p class="condition">${condition}</p>
            <img class="weather-icon" src="http://openweathermap.org/img/w/${iconCode}.png"  alt="${condition}">
        </div>
    `;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    horizontalDaysContainer.innerHTML = '';
    for (let i = 1; i <= 7; i++) {
        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + i);

        const dayName = days[forecastDate.getDay()];
        const dateString = forecastDate.toISOString().split('T')[0];

        const forecastItem = data.list.find(item => item.dt_txt.includes(dateString));
        if (forecastItem) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.innerHTML = `
                <h2>${dayName}</h2>
                <!--<p class="date">${dateString}</p>-->
                <p class="temperature">${forecastItem.main.temp}°C</p>
                <p class="condition">${forecastItem.weather[0].description}</p>
                <img class="weather-icon" src="http://openweathermap.org/img/w/${forecastItem.weather[0].icon}.png" alt="${forecastItem.weather[0].description}">
            `;
            horizontalDaysContainer.appendChild(dayElement);
        }
    }
}

// Function to update weather based on user-entered city
function updateWeatherByCity() {
    city = cityInput.value.trim();
    getWeatherData();
}

document.addEventListener("DOMContentLoaded", function() {
    // Initial fetch and update
    getWeatherData();

    // Fetch and update every second (adjust as needed)
    setInterval(getWeatherData, 1000);
});
