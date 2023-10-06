const form = document.querySelector('form');
const cityInput = document.querySelector('#city');
const cityName = document.querySelector('.city-name');
const temp= document.querySelector('.temp');
const dateElement = document.querySelector('.date');
const weather_description = document.querySelector('.weather-description');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const pressure = document.querySelector('.pressure');
const weatherIcon = document.querySelector('.weather-icon');
const pastDataButton = document.querySelector(".btn");
const pastDataContainer = document.querySelector('.past-data');

const API_KEY = '61a022f39f51f59d4fec11ef3585f829';

// Set the cityInput value to "Carmarthenshire"
cityInput.value = 'Carmarthenshire';

// Submit the form when the page loads
window.addEventListener('load', () => {
  form.dispatchEvent(new Event('submit')); // Dispatch a submit event on the form
});

form.addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent form submission
    const city = cityInput.value;    // Get the value entered in the cityInput field
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    fetch(url)  // Fetching the weather from the API
      .then(response => response.json())  //convert the reponse data in to JSON
      .then(data => {
        if (data.cod === 200) {  // if success (i.e 200 = success)
            // updating the HTML with the value
          const { name, main: { temp: temperature,
            humidity: humidityValue,
            pressure: pressureValue,}, 
          weather: [{ description }], 
          wind: { speed },
          dt: timeValue
        } = data;
          const weatherIconCode = data.weather[0].icon;  // Get the weather icon code
          const date = new Date(timeValue * 1000);
          
          cityName.textContent = name ;
          temp.textContent = `${temperature}°C`;
          weather_description.textContent = description;
          dateElement.textContent = formatDate(date);
          humidity.textContent = `Humidity: ${humidityValue}%`;
          pressure.textContent = `Pressure: ${pressureValue} Pa`;
          wind.textContent = `Wind Speed: ${speed} m/s`;
          weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherIconCode}.png" alt="Weather Icon" >`;

          

        // Call the function to save data to the database
        saveWeatherDataToDatabase(city, data)
            .then(response => {
              console.log(response); // Log the response from the server
            })
            .catch(error => {
              console.error(error);
            });
        } else {  // if failed in finding the city, gives City not found as a result
          cityName.textContent = 'City not found';
          resetArea();  //reset the weather information
        }
      })
      .catch(error => {
        console.error(error);
        cityName.textContent = 'An error occurred, please try again';
        resetArea();
      });
  });

// Function to format the date as "Weekday, Month Day, Year"
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formatedDate = date.toLocaleDateString('en-US', options); //return date in english language
    return formatedDate;
}

// Event listener for "Show Past Data" button
pastDataButton.addEventListener("click", () => {
  const pastDataContainer = document.querySelector(".past-data");
  pastDataContainer.innerHTML = "Loading past data...";

  fetch("weather.php")
    .then(response => response.text())
    .then(data => {
      pastDataContainer.innerHTML = data;
    })
    .catch(error => {
      pastDataContainer.innerHTML = "Error loading past data.";
    });
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


function resetArea(){
    //clearing all the field 
    temp.textContent = '';
    weather_description.textContent = ''; 
    humidity.textContent = '';
    wind.textContent = ''; 
    weatherIcon.innerHTML = '';
}

