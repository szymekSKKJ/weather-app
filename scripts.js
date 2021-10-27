import { setData, setDataAll, setDataAllCurrent } from './setData.js';

navigator.geolocation.getCurrentPosition((response) => {
    const { coords: { latitude, longitude } } = response;
    getCityName(latitude, longitude);
    getCurrentWeather(latitude, longitude);
    getForecast7days(latitude, longitude);
    getForecast24hours(latitude, longitude);
});

const getIcon = (main, hour) => {
    let fontawsomeClass;
    switch (main) {
        case 'Thunderstorm':
            fontawsomeClass = 'fad fa-thunderstorm';
            break;
        case 'Drizzle':
            fontawsomeClass = 'fad fa-cloud-drizzle';
            break;
        case 'Rain':
            fontawsomeClass = 'fad fa-cloud-rain';
            break;
        case 'Snow':
            fontawsomeClass = 'fad fa-cloud-snow';
            break;
        case 'Mist':
            fontawsomeClass = 'fad fa-fog';
            break;
        case 'Smoke':
            fontawsomeClass = 'fad fa-fog';
            break;
        case 'Haze':
            fontawsomeClass = 'fad fa-fog';
            break;
        case 'Dust':
            fontawsomeClass = 'fad fa-fog';
            break;
        case 'Fog':
            fontawsomeClass = 'fad fa-fog';
            break;
        case 'Sand':
            fontawsomeClass = 'fad fa-fog';
            break;
        case 'Ash':
            fontawsomeClass = 'fad fa-fog';
            break;
        case 'Squall':
            fontawsomeClass = 'fad fa-fog';
            break;
        case 'Tornado':
            fontawsomeClass = 'fad fa-fog';
            break;
        case 'Clear':
            fontawsomeClass = 'fad fa-sun';
            break;
        case 'Clouds':
            fontawsomeClass = 'fad fa-clouds';
            break;
        default:
            fontawsomeClass = 'fad fa-sun';
    }
    return fontawsomeClass;
}

const getDayName = (value) => {
    let day;
    switch (value) {
        case 0:
            day = 'Poniedziałek';
            break;
        case 1:
            day = 'Wtorek';
            break;
        case 2:
            day = 'Środa';
            break;
        case 3:
            day = 'Czwartek';
            break;
        case 4:
            day = 'Piątek';
            break;
        case 5:
            day = 'Sobota';
            break;
        case 6:
            day = 'Niedziela';
            break;
        default:
            day = undefined;
    }
    return day;
}

const isDayChangingColor = (sunset, sunrise) => {
    const hourlyWeather = document.querySelector('#hourly-weather');
    const dailyWeather = document.querySelector('#daily-weather');
    const currentDate = Date.now();
    document.body.style.opacity = '1';
    if (currentDate > sunrise && currentDate < sunset) {
        document.body.style.backgroundColor = '#528ec7';
        hourlyWeather.style.backgroundColor = 'rgba(158, 191, 224, 0.3)';
        dailyWeather.style.backgroundColor = 'rgba(158, 191, 224, 0.3)';
    } else if (currentDate > sunset) {
        document.body.style.backgroundColor = '#121a21';
        hourlyWeather.style.backgroundColor = 'rgba(91, 130, 164, 0.15)';
        dailyWeather.style.backgroundColor = 'rgba(91, 130, 164, 0.15)';
    }
    //This function is getting data from actuall (not previous) day, so if there is after midnight, both are false and there is a night beacuse is before this day sunrise
    //Then setting night colors
    else {
        document.body.style.backgroundColor = '#121a21';
        hourlyWeather.style.backgroundColor = 'rgba(91, 130, 164, 0.15)';
        dailyWeather.style.backgroundColor = 'rgba(91, 130, 164, 0.15)';

    }
    localStorage.setItem('backgroundColor', document.body.style.backgroundColor);
    localStorage.setItem('itemColorGlass', hourlyWeather.style.backgroundColor);
}

const settingBackgroundAnimation = (sunset, sunrise) => {
    //Setting previous colors
    const hourlyWeather = document.querySelector('#hourly-weather');
    const dailyWeather = document.querySelector('#daily-weather');
    document.body.style.backgroundColor = localStorage.getItem('backgroundColor');
    hourlyWeather.style.backgroundColor = localStorage.getItem('itemColorGlass');
    dailyWeather.style.backgroundColor = localStorage.getItem('itemColorGlass');
    setTimeout(() => {
        document.body.style.transition = 'background-color 5000ms, opacity 2000ms';
        isDayChangingColor(sunset, sunrise);
    }, 250);
}

const getCityName = async(latitude, longitude) => {
    try {
        const apiKey = 'Ancrj4SvPPA8T02d2Vr8Wg2L7ie2podi';
        const response = await fetch(`https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.JSON?key=${apiKey}&language=pl-PL`);
        const { addresses: [{ address: { localName } }] } = await response.json();
        setData('#city-name', localName);
    } catch {
        setData('#city-name', 'Błąd podczas ładowania');
    }
}

const getCurrentWeather = async(latitude, longitude) => {
    try {
        const apiKey = '4a41cfb8e9604376029318530c3c38a9';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=pl&units=metric`);
        const { main: { temp }, weather: [{ description }], sys: { sunset, sunrise } } = await response.json();
        const getTemperature = `${Math.round(temp)}&#176`;
        setData('#temperature', getTemperature);
        setData('#weather-description', description);
        settingBackgroundAnimation(sunset * 1000, sunrise * 1000); // Converting to ms
    } catch {
        setData('#temperature', '');
        setData('#weather-description', 'Błąd podczas ładowania');
    }
}

const getForecast24hours = async(latitude, longitude) => {
    try {
        const apiKey = '4a41cfb8e9604376029318530c3c38a9';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current&appid=${apiKey}&lang=pl&units=metric`);
        const { hourly } = await response.json();

        for (let i = 0; i < 24; i++) {
            const hourlyWeatherItemIcon = document.querySelectorAll('.hourly-weather-item i');
            const getHour = new Date(hourly[i].dt * 1000).getHours();
            const getTemperature = `${Math.round(hourly[i].temp)}&#176`;
            const getMain = hourly[i].weather[0].main;
            getHour < 10 ? setDataAllCurrent('.hourly-weather-item', `0${getHour}:00`, i, 1) : setDataAllCurrent('.hourly-weather-item', `${getHour}:00`, i, 1);
            setDataAllCurrent('.hourly-weather-item', getTemperature, i, 0);
            hourlyWeatherItemIcon[i].className = getIcon(getMain);
        }
    } catch {
        return;
    }
}

const getForecast7days = async(latitude, longitude) => {
    try {
        const apiKey = '4a41cfb8e9604376029318530c3c38a9';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current&appid=${apiKey}&lang=pl&units=metric`);
        const { daily } = await response.json();

        for (let i = 0; i < 7; i++) {
            const dailyIcon = document.querySelectorAll('.deg-and-icon i')
            const getDay = new Date(daily[i].dt * 1000).getDay();
            const getTemperature = `${Math.round(daily[i].temp.day)}&#176`;
            const getMain = daily[i].weather[0].main;
            setDataAllCurrent('.daily-weather-item', getDayName(getDay), i);
            setDataAllCurrent('.deg-and-icon', getTemperature, i);
            dailyIcon[i].className = getIcon(getMain)
        }
    } catch {
        return;
    }
}