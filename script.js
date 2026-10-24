const unitBtn = document.getElementById("units-btn");
const unitsMenu = document.getElementById("units-menu");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const weatherContainer = document.getElementById("weather-container");
const dailyContainer = document.getElementById("daily-forecast-container");
const hourlyContainer = document.getElementById("hourly-forecast-container");
const hourlyDaySelect = document.getElementById("hourly-day-select");
const retryBtn = document.getElementById("retry-btn");
const errorContainer = document.getElementById("error-container");
const loca = document.getElementById("loca");
const dateEl = document.getElementById("date");
const degreeEl = document.getElementById("degree");
const feelsEl = document.getElementById("feel");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const precEl = document.getElementById("prec");
const noResultContainer = document.getElementById("no-result");
const searchSectionWrapper = document.getElementById("search-section-wrapper");
const todayCardEl = document.getElementById("today-card");
const searchDropdown = document.getElementById("search-dropdown");
const celsiusBtn = document.getElementById("celsius-btn");
const fahrenheitBtn = document.getElementById("fahrenheit-btn");
const kmhBtn = document.getElementById("kmh-btn");
const mphBtn = document.getElementById("mph-btn");
const mmBtn = document.getElementById("mm-btn");
const inchesBtn = document.getElementById("inches-btn");
const unitsModeBtn = document.getElementById("units-mode-btn");
const modeIndicator = document.getElementById("mode-indicator");

let currentWeatherData = null;
let currentFullLocation = "";
let currentFormattedDate = "";
let isCelsius = true;
let isKmh = true;
let isMm = true;

async function loadData(searchTerm) {
  try {
    errorContainer.classList.add("hidden");
    weatherContainer.classList.remove("hidden");
    noResultContainer.classList.add("hidden");
    searchSectionWrapper.classList.remove("hidden");
    searchDropdown.classList.remove("hidden");

    showLoadingState();
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${searchTerm}`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    searchDropdown.classList.add("hidden");

    if (!geoData.results || geoData.results.length === 0) {
      errorContainer.classList.add("hidden");
      weatherContainer.classList.add("hidden");
      noResultContainer.classList.remove("hidden");
      searchSectionWrapper.classList.remove("hidden");
      return;
    }

    const lat = geoData.results[0].latitude;
    const lo = geoData.results[0].longitude;
    const locationName = geoData.results[0].name;
    const country = geoData.results[0].country || "";
    currentFullLocation = `${locationName}, ${country}`;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lo}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    currentWeatherData = weatherData;

    const dateObj = new Date(weatherData.current.time);
    currentFormattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    displayWeather(weatherData, currentFullLocation, currentFormattedDate);
  } catch (error) {
    console.log("Failed to fetch data", error);
    searchDropdown.classList.add("hidden");
    showError();
  }
}

searchBtn.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) loadData(searchTerm);
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) loadData(searchTerm);
  }
});

retryBtn.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim() || "lagos";
  loadData(searchTerm);
});

function convertTemp(celsius) {
  if (isCelsius) return Math.round(celsius);
  return Math.round((celsius * 9) / 5 + 32);
}

function convertWind(kmh) {
  if (isKmh) return kmh;
  return Math.round(kmh * 0.621371);
}

function convertPrecipitation(mm) {
  if (isMm) return `${mm} mm`;
  const inches = mm * 0.0393701;
  return `${inches.toFixed(1)} in`;
}

function displayWeather(weatherData, fullLocation, formattedDate) {
  if (todayCardEl) {
    todayCardEl.style.backgroundImage = "";
    todayCardEl.classList.remove("bg-Neutral-700");
    todayCardEl.innerHTML = `
            <div class="flex flex-col gap-2 md:text-left">
                <span id="loca" class="text-3xl">${fullLocation}</span>
                <span id="date" class="text-Neutral-200">${formattedDate}</span>
            </div>
            <div class="flex items-center gap-4">
                <span><img class="w-25 h-full" src="${getWeatherIcon(weatherData.current.weather_code)}" alt="weather icon"></span>
                <span id="degree" class="text-9xl md:text-5xl font-bold">${convertTemp(weatherData.current.temperature_2m)}°</span>
            </div>
        `;
  }

  feelsEl.textContent = `${convertTemp(weatherData.current.apparent_temperature)}°`;
  humidityEl.textContent = `${weatherData.current.relative_humidity_2m}%`;
  windEl.textContent = `${convertWind(weatherData.current.wind_speed_10m)} ${isKmh ? "km/h" : "mph"}`;
  precEl.textContent = convertPrecipitation(weatherData.current.precipitation);

  dailyContainer.innerHTML = "";
  for (let i = 0; i < weatherData.daily.time.length; i++) {
    const dateStr = weatherData.daily.time[i];
    const maxTemp = convertTemp(weatherData.daily.temperature_2m_max[i]);
    const minTemp = convertTemp(weatherData.daily.temperature_2m_min[i]);
    const weatherCode = weatherData.daily.weather_code[i];

    const dayName = new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
    });
    const iconSrc = getWeatherIcon(weatherCode);

    dailyContainer.innerHTML += `
            <div class="bg-Neutral-600 text-Neutral-0 p-3 rounded-lg flex flex-col items-center justify-between">
                <span class="text-sm font-semibold">${dayName}</span>
                <img src="${iconSrc}" alt="weather icon" class="w-10 h-10 my-2">
                <div class="flex gap-2 text-sm">
                    <span>${maxTemp}°</span>
                    <span class="text-Neutral-400">${minTemp}°</span>
                </div>
            </div>
        `;
  }

  renderHourlyDropdown(weatherData);
  const selectedIndex =
    hourlyDaySelect.value !== "" ? parseInt(hourlyDaySelect.value, 10) : 0;
  hourlyDaySelect.value = selectedIndex;
  renderHourlyForecast(weatherData, selectedIndex);
}

function getWeatherIcon(code) {
  if (code === 0) return "./assets/images/icon-sunny.webp";
  if (code === 1 || code === 2)
    return "./assets/images/icon-partly-cloudy.webp";
  if (code === 3) return "./assets/images/icon-overcast.webp";
  if (code === 45 || code === 48) return "./assets/images/icon-fog.webp";
  if (code >= 51 && code <= 57) return "./assets/images/icon-drizzle.webp";
  if (code >= 61 && code <= 67) return "./assets/images/icon-rain.webp";
  if (code >= 80 && code <= 82) return "./assets/images/icon-rain.webp";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    return "./assets/images/icon-snow.webp";
  if (code >= 95 && code <= 99) return "./assets/images/icon-storm.webp";
  return "./assets/images/icon-sunny.webp";
}

function renderHourlyDropdown(weatherData) {
  const previousSelection = hourlyDaySelect.value;
  hourlyDaySelect.innerHTML = "";

  for (let i = 0; i < weatherData.daily.time.length; i++) {
    const dateStr = weatherData.daily.time[i];
    const dayName = new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const option = document.createElement("option");
    option.value = i;
    option.textContent = i === 0 ? "Today" : dayName;
    hourlyDaySelect.appendChild(option);
  }
  if (
    previousSelection !== "" &&
    previousSelection < weatherData.daily.time.length
  ) {
    hourlyDaySelect.value = previousSelection;
  }
}

function renderHourlyForecast(weatherData, dayIndex = 0) {
  hourlyContainer.innerHTML = "";

  const startIndex = dayIndex * 24;
  const endIndex = startIndex + 24;

  for (let i = startIndex; i < endIndex; i += 3) {
    const timeStr = weatherData.hourly.time[i];
    const temp = convertTemp(weatherData.hourly.temperature_2m[i]);
    const code = weatherData.hourly.weather_code[i];

    const formattedTime = new Date(timeStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });

    const iconSrc = getWeatherIcon(code);

    hourlyContainer.innerHTML += `
            <div class="flex justify-between text-Neutral-0 border border-Neutral-600 bg-Neutral-700 shadow shadow:lg p-3 rounded-lg">
              <div class="flex gap-2">
                <img src="${iconSrc}" alt="weather icon" class="w-6 h-6">
                <span>${formattedTime}</span>
              </div>  
              <span>${temp}°</span>
            </div>
        `;
  }
}

function showLoadingState() {
  if (todayCardEl) {
    todayCardEl.style.backgroundImage = "none";
    todayCardEl.classList.add("bg-Neutral-700");
    todayCardEl.innerHTML = `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto space-y-3">
                <img src="./assets/images/icon-loading.svg" alt="loading..." class="w-8 h-8 animate-spin">
                <span class="text-sm font-medium text-neutral-200">Loading...</span>
            </div>
        `;
  }

  feelsEl.textContent = "-";
  humidityEl.textContent = "-";
  windEl.textContent = "-";
  precEl.textContent = "-";

  dailyContainer.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    dailyContainer.innerHTML += `
            <div class="bg-Neutral-600 p-3 rounded-lg flex flex-col items-center justify-between h-28"></div>
        `;
  }

  hourlyContainer.innerHTML = "";
  hourlyDaySelect.innerHTML = `<option value="">—</option>`;
}

function showError() {
  errorContainer.classList.remove("hidden");
  weatherContainer.classList.add("hidden");
  searchSectionWrapper.classList.add("hidden");
  noResultContainer.classList.add("hidden");
}

unitBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  unitsMenu.classList.toggle("hidden");
  const isExpanded = !unitsMenu.classList.contains("hidden");
  unitBtn.setAttribute("aria-expanded", isExpanded);
});

window.addEventListener("click", () => {
  if (!unitsMenu.classList.contains("hidden")) {
    unitsMenu.classList.add("hidden");
  }
});

unitsMenu.addEventListener("click", (event) => {
  event.stopPropagation();
});

// Unit Menu Click Handlers & Checkmark Toggles
unitsModeBtn.addEventListener("click", () => {
  isCelsius = !isCelsius;
  isKmh = isCelsius;
  isMm = isCelsius;

  if (isCelsius) {
    celsiusBtn.querySelector(".temp-check").classList.remove("hidden");
    fahrenheitBtn.querySelector(".temp-check").classList.add("hidden");
    kmhBtn.querySelector(".wind-check").classList.remove("hidden");
    mphBtn.querySelector(".wind-check").classList.add("hidden");
    mmBtn.querySelector(".precip-check").classList.remove("hidden");
    inchesBtn.querySelector(".precip-check").classList.add("hidden");
    modeIndicator.textContent = "Metric";
    unitsModeBtn.querySelector("span:first-child").textContent =
      "Switch to Imperial";
  } else {
    fahrenheitBtn.querySelector(".temp-check").classList.remove("hidden");
    celsiusBtn.querySelector(".temp-check").classList.add("hidden");
    mphBtn.querySelector(".wind-check").classList.remove("hidden");
    kmhBtn.querySelector(".wind-check").classList.add("hidden");
    inchesBtn.querySelector(".precip-check").classList.remove("hidden");
    mmBtn.querySelector(".precip-check").classList.add("hidden");
    modeIndicator.textContent = "Imperial";
    unitsModeBtn.querySelector("span:first-child").textContent =
      "Switch to Metric";
  }

  if (currentWeatherData) {
    displayWeather(
      currentWeatherData,
      currentFullLocation,
      currentFormattedDate,
    );
  }
});

celsiusBtn.addEventListener("click", () => {
  isCelsius = true;
  celsiusBtn.querySelector(".temp-check").classList.remove("hidden");
  fahrenheitBtn.querySelector(".temp-check").classList.add("hidden");
  if (currentWeatherData) {
    displayWeather(
      currentWeatherData,
      currentFullLocation,
      currentFormattedDate,
    );
  }
});

fahrenheitBtn.addEventListener("click", () => {
  isCelsius = false;
  fahrenheitBtn.querySelector(".temp-check").classList.remove("hidden");
  celsiusBtn.querySelector(".temp-check").classList.add("hidden");
  if (currentWeatherData) {
    displayWeather(
      currentWeatherData,
      currentFullLocation,
      currentFormattedDate,
    );
  }
});

kmhBtn.addEventListener("click", () => {
  isKmh = true;
  kmhBtn.querySelector(".wind-check").classList.remove("hidden");
  mphBtn.querySelector(".wind-check").classList.add("hidden");
  if (currentWeatherData) {
    displayWeather(
      currentWeatherData,
      currentFullLocation,
      currentFormattedDate,
    );
  }
});

mphBtn.addEventListener("click", () => {
  isKmh = false;
  mphBtn.querySelector(".wind-check").classList.remove("hidden");
  kmhBtn.querySelector(".wind-check").classList.add("hidden");
  if (currentWeatherData) {
    displayWeather(
      currentWeatherData,
      currentFullLocation,
      currentFormattedDate,
    );
  }
});

mmBtn.addEventListener("click", () => {
  isMm = true;
  mmBtn.querySelector(".precip-check").classList.remove("hidden");
  inchesBtn.querySelector(".precip-check").classList.add("hidden");
  if (currentWeatherData) {
    displayWeather(
      currentWeatherData,
      currentFullLocation,
      currentFormattedDate,
    );
  }
});

inchesBtn.addEventListener("click", () => {
  isMm = false;
  inchesBtn.querySelector(".precip-check").classList.remove("hidden");
  mmBtn.querySelector(".precip-check").classList.add("hidden");
  if (currentWeatherData) {
    displayWeather(
      currentWeatherData,
      currentFullLocation,
      currentFormattedDate,
    );
  }
});

hourlyDaySelect.addEventListener("change", (e) => {
  if (!currentWeatherData) return;
  const selectedDayIndex = parseInt(e.target.value, 10);
  renderHourlyForecast(currentWeatherData, selectedDayIndex);
});

loadData("lagos");
