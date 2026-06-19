const apiKey = '30b4912cdb2984dc61ddbc33ce041d42';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

const searchInput = document.querySelector('.searchbar');
const searchBtn = document.querySelector('.searchbtn');
const weatherInfo = document.querySelector('.weatherinfo');
const errorImg = document.querySelector('.error-img');
const defaultImg = document.querySelector('.default-img');
const loader = document.getElementById('loader');

// Show loader on initial load
window.addEventListener('load', () => {
    loader.style.display = "flex";
    // Optional: Hide it after 1.5s so user sees the animation on first open
    setTimeout(() => { loader.style.display = "none"; }, 1500);
});

async function checkWeather(city) {
    if (!city) return;

    // Show loader and hide all other states during search
    loader.style.display = "flex";
    defaultImg.style.display = "none";
    errorImg.style.display = "none";
    weatherInfo.style.display = "none";

    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        
        // Simulating a delay so the animation is visible
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (response.status == 404) {
            errorImg.style.display = "block";
            weatherInfo.style.display = "none";
        } else {
            const data = await response.json();

            document.querySelector(".place").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humiditypercentage").innerHTML = data.main.humidity + "%";
            document.querySelector(".speed").innerHTML = data.wind.speed + " m/s";
            document.querySelector(".pascal").innerHTML = data.main.pressure + " hPa";
            document.querySelector(".weather").innerHTML = data.weather[0].main;

            const d = new Date();
            const dateString = d.toLocaleDateString('en-GB', { 
                weekday: 'short', day: '2-digit', month: 'short' 
            });
            document.querySelector(".date").innerHTML = dateString;

            const iconElement = document.querySelector(".weathersymbol");
            const condition = data.weather[0].main.toLowerCase();
            const myFiles = ["clear", "clouds", "drizzle", "rain", "snow", "thunderstorm"];

            if (myFiles.includes(condition)) {
                iconElement.src = `weather/${condition}.svg`;
            } else if (["haze", "mist", "smoke", "fog", "dust"].includes(condition)) {
                iconElement.src = `weather/atmosphere.svg`;
            } else {
                iconElement.src = `weather/clouds.svg`;
            }

            weatherInfo.style.display = "block";
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        errorImg.style.display = "block";
    } finally {
        // Hide loader once process is complete
        loader.style.display = "none";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchInput.value);
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchInput.value);
    }
});