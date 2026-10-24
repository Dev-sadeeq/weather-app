# Frontend Mentor - Weather app solution

This is a solution to the [Weather app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Search for weather information by entering a location in the search bar
- View current weather conditions including temperature, weather icon, and location details
- See additional weather metrics like "feels like" temperature, humidity percentage, wind speed, and precipitation amounts
- Browse a 7-day weather forecast with daily high/low temperatures and weather icons
- View an hourly forecast showing temperature changes throughout the day
- Switch between different days of the week using the day selector in the hourly forecast section
- Toggle between Imperial and Metric measurement units via the units dropdown 
- Switch between specific temperature units (Celsius and Fahrenheit) and measurement units for wind speed (km/h and mph) and precipitation (millimeters) via the units dropdown
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Screenshot

![](./screenshots/mobile.ppg);
![](./screenshots/desktop.ppg);
![](./screenshots/desktop2.ppg);


### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup
- Tailwind CSS (v3/v4 utility classes)
- Vanilla JavaScript (ES6+)
- Flexbox & CSS Grid for dynamic cards
- Mobile-first workflow
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs)

### What I learned

Through this project, I gained hands-on experience connecting asynchronous APIs, handling real-time unit conversions, managing dynamic UI renders, and adhering to accessibility standards.

1. **Client-Side Unit Conversions**:
   Instead of refetching data from the API every time a unit changes, I stored the raw weather data in a state variable (`currentWeatherData`) and performed client-side math to convert units dynamically.

```javascript
function convertTemp(celsius) {
    if (isCelsius) return Math.round(celsius);
    return Math.round((celsius * 9/5) + 32);
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
```

2. Accessibility (a11y):
Added key ARIA attributes such as aria-haspopup="true", aria-expanded, and aria-label to custom dropdowns and search fields to ensure smooth screen reader navigation.

```Html
<button id="units-btn" aria-haspopup="true" aria-expanded="false" aria-label="Toggle units menu" class="inline-flex items-center cursor-pointer bg-neutral-800 text-neutral-0 rounded-md px-3 py-1.5 hover:bg-neutral-700 transition-colors">
  <img src="./assets/images/icon-units.svg" alt="" class="w-4 h-4 mr-2 pointer-events-none">
  <span class="text-Neutral-0">Units</span>
  <img src="./assets/images/icon-dropdown.svg" alt="dropdown arrow" class="w-4 h-4 ml-2 pointer-events-none">
</button>
```

### Continued development

In future projects, I plan to:

-Implement debouncing on input fields for auto-suggesting search locations in real-time.
-Enhance keyboard navigation support (e.g., closing dropdown menus with the Escape key).
-Add local storage persistence so users' unit preferences (Imperial/Metric) remain saved across browser sessions.

### Useful resources

- [Open-Meteo API Documentation](https://open-meteo.com/en/docs) - Clear details on endpoints for geocoding and hourly weather forecasts.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Invaluable guide for responsive grid layouts and utility classes.


## Author

- Frontend Mentor - [@Dev-sadeeq](https://www.frontendmentor.io/profile/Dev-sadeeq)
- Twitter - [@Dev_sadeeqq](https://www.twitter.com/Dev_sadeeqq)

