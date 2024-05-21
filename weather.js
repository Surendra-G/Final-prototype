const form = document.querySelector('form');
const cityInput = document.querySelector('#city');
const cityName = document.querySelector('.city-name');
const temp = document.querySelector('.temp');
const dateElement = document.querySelector('.date');
const weather_description = document.querySelector('.weather-description');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const pressure = document.querySelector('.pressure');
const weatherIcon = document.querySelector('.weather-icon');
const pastDataButton = document.querySelector("#past-data-button");
const pastDataContainer = document.querySelector('.past-data');

const API_KEY = '61a022f39f51f59d4fec11ef3585f829';

// Set the cityInput value to "Carmarthenshire"
cityInput.value = 'Carmarthenshire';

// Function to save weather data to local storage
function saveWeatherDataToLocalStorage(city, data) {
  const weatherData = {
    city: city,
    data: data,
  };
  localStorage.setItem(city, JSON.stringify(weatherData));
}

// Function to retrieve weather data from local storage
function getWeatherDataFromLocalStorage(city) {
  const weatherDataJSON = localStorage.getItem(city);
  return JSON.parse(weatherDataJSON);
}

// Function to update the weather display with saved data
function updateWeatherDisplay(city, data) {
    const {
        main: { temp: temperature, humidity: humidityValue, pressure: pressureValue },
        weather: [{ description }],
        wind: { speed },
        dt: timeValue,
      } = data;
      const weatherIconCode = data.weather[0].icon;
      const date = new Date(timeValue * 1000);
    
      cityName.textContent = city;
      temp.textContent = `${temperature}°C`;
      weather_description.textContent = description;
      dateElement.textContent = formatDate(date);
      humidity.textContent = `Humidity: ${humidityValue}%`;
      pressure.textContent = `Pressure: ${pressureValue} Pa`;
      wind.textContent = `Wind Speed: ${speed} m/s`;
      weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherIconCode}.png" alt="Weather Icon" >`;
}

// Function to format the date
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}

// Load weather data for default city (Carmarthenshire) on page load
window.addEventListener('load', () => {
  const defaultCity = cityInput.value;
  const storedWeatherData = getWeatherDataFromLocalStorage(defaultCity);
  if (storedWeatherData) {
    updateWeatherDisplay(defaultCity, storedWeatherData.data);
  } else {
    // Fetch and display weather data for the default city
    fetchWeatherAndDisplay(defaultCity);
  }
});


// Fetch weather data, display it, and save to local storage
function fetchWeatherAndDisplay(city) {
    const storedWeatherData = getWeatherDataFromLocalStorage(city);
    if (storedWeatherData) {
      updateWeatherDisplay(city, storedWeatherData.data);
    } else {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('City not found');
          }
          return response.json();
        })
        .then((data) => {
          updateWeatherDisplay(city, data);
          saveWeatherDataToLocalStorage(city, data);
          saveWeatherDataToDatabase(city, data);
        })
        .catch((error) => {
          console.error(error);
          cityName.textContent = 'City Not Found';
          temp.textContent = '';
          weather_description.textContent = '';
          dateElement.textContent = '';
          humidity.textContent = '';
          pressure.textContent = '';
          wind.textContent = '';
          weatherIcon.innerHTML = '';
        });
    }
  }
  

// Submit the form to fetch weather data
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value;
  fetchWeatherAndDisplay(city);
});


// Save weather data to the local database

function saveWeatherDataToDatabase(city, data) {   // this function helps to save weather data to a database by making an HTTP POST request to a PHP script (weather.php)
    return fetch("weather.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ city, data })
    })
      .then(response => response.text())
      .catch(error => { 
        throw new Error("Error saving data to the database.");
      });
  }

// Event listener for "Show Past Data" button
pastDataButton.addEventListener("click", () => {
  pastDataContainer.innerHTML = "Loading past data...";
  
  const searchedCity = cityInput.value;
  
  fetch(`past.php?city=${searchedCity}`)
    .then(response => response.text())
    .then(data => {
      pastDataContainer.innerHTML = data;
    })
    .catch(error => {
      pastDataContainer.innerHTML = "Error loading past data.";
    });
});
