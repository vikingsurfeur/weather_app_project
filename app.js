/** 
    * WEATHER APP PROJECT
    * AUTHOR : DAVID BOUSCARLE
    * API : OPEN WEATHER API
**/


const
    cityValue               = document.querySelector('#city__value'),
    weatherDisplay          = document.querySelector('.main__weather__data'),
    tempDisplay             = document.querySelector('.main__temp__data'),
    pressureDisplay         = document.querySelector('.main__pressure__data'),
    humidityDisplay         = document.querySelector('.main__humidity__data'),
    windSpeedDisplay        = document.querySelector('.main__wind__speed__data'),
    windDirectionDisplay    = document.querySelector('.main__wind__direction__data'),
    windGustDisplay         = document.querySelector('.main__wind__gust__data'),
    sunriseDisplay          = document.querySelector('.main__sunrise__data'),
    sunsetDisplay           = document.querySelector('.main__sunset__data');

// API VARIABLES

const 
    units       = 'metric',
    celsius     = '°C',
    hectoPascal = 'hPa',
    percent     = '%',
    speed       = 'km/h',
    north       = 340,
    northEast   = 20,
    east        = 70,
    southEast   = 110,
    south       = 160,
    southWest   = 200,
    west        = 250,
    northWest   = 290,
    rainLight   = ['light rain', 'moderate rain'],
    rainShower  = ['light intensity shower rain', 'shower rain', 'heavy intensity shower rain', 'ragged shower rain'],
    rainHeavy   = ['heavy intensity rain', 'very heavy rain'];

let city        = cityValue.value;

// URL VARIABLE

let urlCurrentWeatherRequest= 
    'https://api.openweathermap.org/data/2.5/weather?q=' +
    city +
    '&units=' +
    units +
    '&appid=ce901c6857cf6809af1d9e7195187878';

// LISTENERS

cityValue.addEventListener('change', () => {
    city = cityValue.options[cityValue.selectedIndex].text;
    
    urlCurrentWeatherRequest =
        'https://api.openweathermap.org/data/2.5/weather?q=' +
        city +
        '&units=' +
        units +
        '&appid=ce901c6857cf6809af1d9e7195187878';

    getApiDataCallHandler();
});

// FUNCTIONS

const getApiDataCallHandler = () => {
    // ASYNC CALL API
    const getApiCallHandler = async (url) => {
        try {
            const response = await fetch(url);
            return response.json();
        } catch (error) {
            console.error('Something get wrong: ' + error);
        }
    };
    
    // // TEMPORARY DEBUG

    // console.log(getApiCallHandler(urlCurrentWeatherRequest))

    // GET GLOBAL DATA ABOUT TEMP, PRESSURE AND HUMIDITY

    const getApiGlobalDataCall      = getApiCallHandler(urlCurrentWeatherRequest).then((response) => {
        tempDisplay.textContent     = response.main.feels_like + celsius;
        pressureDisplay.textContent = response.main.pressure + hectoPascal;
        humidityDisplay.textContent = response.main.humidity + percent;
    });

    // GET WIND DATA

    const getApiWindDataCall = getApiCallHandler(urlCurrentWeatherRequest).then((response) => {
        windSpeedDisplay.textContent = response.wind.speed + speed;

        response.wind.gust === undefined
            ? (windGustDisplay.textContent = 0 + speed)
            : (windGustDisplay.textContent = response.wind.gust + speed);
        
        let windDeg = response.wind.deg;
        if (windDeg > north || windDeg < northEast) {
            windDirectionDisplay.textContent = 'N';
        } else if (windDeg > northEast && windDeg < east) {
            windDirectionDisplay.textContent = 'NE';
        } else if (windDeg > east && windDeg < southEast) {
            windDirectionDisplay.textContent = 'E';
        } else if (windDeg > southEast && windDeg < south) {
            windDirectionDisplay.textContent = 'SE';
        } else if (windDeg > south && windDeg < southWest) {
            windDirectionDisplay.textContent = 'S';
        } else if (windDeg > southWest && windDeg < west) {
            windDirectionDisplay.textContent = 'SW';
        } else if (windDeg > west && windDeg < northWest) {
            windDirectionDisplay.textContent = 'W';
        } else {
            windDirectionDisplay.textContent = 'NW';
        }  
    });

    // GET WEATHER CONDITION

    const getApiWeatherDataCall = getApiCallHandler(urlCurrentWeatherRequest).then((response) => {
        response.weather.forEach((weather) => {
            switch (weather.main) {
                case 'Clouds':
                    getSortCloudyWeather(weather.description);
                    break;

                case 'Clear':
                    weatherDisplay.textContent = 'super beau';
                    break;

                case 'Athmosphere':
                    weatherDisplay.textContent = 'Super Hazy';
                    break;

                case 'Snow':
                    weatherDisplay.textContent = 'Neige';
                    break;

                case 'Rain':
                    getSortRainyWeather(weather.description);
                    break;

                case 'Drizzle':
                    weatherDisplay.textContent = 'Bruine';
                    break;

                case 'Thunderstorm':
                    weatherDisplay.textContent = 'Tempête';
                    break;

                default:
                    break;
            }
        });
    });

    // GET SUNRISE HOUR

    const getApiSunriseHourCallData = getApiCallHandler(urlCurrentWeatherRequest).then((response) => {
        getSunriseSunsetHour(response.sys.sunrise);
    });

    // GET SUNSET HOUR

    const getApiSunsetHourCallData = getApiCallHandler(urlCurrentWeatherRequest).then((response) => {
        getSunriseSunsetHour(response.sys.sunset);
    });

    return 
        getApiGlobalDataCall, 
        getApiWindDataCall, 
        getApiWeatherDataCall, 
        getApiSunriseHourCallData, 
        getApiSunsetHourCallData;
};

// INITIALIZING THE APP

getApiDataCallHandler();

// FUNCTION SORT CLOUDY WEATHER

function getSortCloudyWeather(cloudyWeather) {
    switch (cloudyWeather) {
        case 'overcast clouds':
            return (weatherDisplay.textContent = 'Super Caca');

        case 'broken clouds':
            return (weatherDisplay.textContent = 'Mostly Caca');

        case 'scattered clouds':
            return (weatherDisplay.textContent = 'Caca');

        case 'few clouds':
            return (weatherDisplay.textContent = 'Lightly Caca');

        default:
            break;
    }
}

// FUNCTION SORT RAINY WEATHER

function getSortRainyWeather(rainyWeather) {
    if (rainyWeather.includes(rainLight)) {
        return (weatherDisplay.textContent = 'pluie légère');
    } else if (rainyWeather.includes(rainShower)) {
        return (weatherDisplay.textContent = 'averses de pluie');
    } else {
        return (weatherDisplay.textContent = 'forte pluie');
    }
}

// FUNCTION SUNRISE / SUNSET HOUR

function getSunriseSunsetHour(hour) {
    let unixTimeStamp = hour;
    let milliSeconds = unixTimeStamp * 1000;
    let hourObject = new Date(milliSeconds);
    let humanFriendlyHour = hourObject.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    if (humanFriendlyHour <= '12:00') {
        return sunriseDisplay.textContent = humanFriendlyHour;
    } else {
        return sunsetDisplay.textContent = humanFriendlyHour;
    }
};

