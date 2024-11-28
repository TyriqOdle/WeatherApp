const citySearch = document.querySelector("#city-search")
const apiKey = "REDACTED"
const current_temp = document.querySelector("#current-temp")
const TODAY_FORECAST_CARDS = document.querySelector(".cards-for")
const DAILY_FORECAST_CARDS = document.querySelector(".cards-hor")
let city = "Barbados"
let lat;
let lon;
let current_feels_like;
let currnet_windSpeed;
let current_humidity;
let current_temperture;
let current_temperture_max;
let current_temperture_min;
let weather_icon;
let currrent_desc;
let time;
let forecast_icon;
let forecast_temp;
let timeString;
let forecastUnix;
let forecast_Daily_Max;
let forecast_Daily_Min;
let forecast_Daily_Icon;
let forecast_Daily_Desc;


window.addEventListener("load", getCity)

citySearch.addEventListener("blur", async () =>{
    city = citySearch.value;
    console.log(city)

    getCity()
    
})


async function getCity(){
    try{
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)

        if(!response.ok){
            throw new Error("Could not get location data")
        }

        const data = await response.json()
        lat = data[0].lat
        lon = data[0].lon
        console.log(data[0].lat)

        await getCurrent();
        await getForecast()
        displayCurrent()
        displayForecast()
        
    }
    catch(error){
        console.error(error);
        
    }
}


async function getCurrent() {
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric `)

        if(!response.ok){
            throw new Error("Could not get weather data")
        }

        const weather_data = await response.json()

        console.log("CURRENT")
        console.log(weather_data)

        current_feels_like = weather_data.main.feels_like
        current_humidity = weather_data.main.humidity
        current_temperture = weather_data.main.temp
        current_temperture_max = weather_data.main.temp_max
        current_temperture_min = weather_data.main.temp_min 
        currnet_windSpeed =weather_data.wind.speed

        weather_icon = weather_data.weather[0].icon
        currrent_desc = weather_data.weather[0].description
        
    }
    catch(error){
        console.error(error)
    }
    
}


async function getForecast(){
    try{
        let response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&limit=5`)

        if(!response.ok){
            throw new Error("Could not fetch forecast data")
        }

        const forecast_Data = await response.json()

        console.log("Forecast ......")
        console.log(forecast_Data)

        //Clearing existing forcast 
        TODAY_FORECAST_CARDS.innerHTML = ""

        //Hourly forecast cards
        forecast_Data.list.forEach(hour => {
            time = hour.dt 
            forecast_temp = hour.main.temp
            forecast_icon = hour.weather[0].icon
            

            displayForecast();
        });

        let currentDateString = forecast_Data.list[0].dt_txt.split(" ")
        
        console.log(currentDateString)

        DAILY_FORECAST_CARDS.innerHTML = ""        
        //Daily forecasts
        forecast_Data.list.forEach(hour  =>{
            let dateString = hour.dt_txt.split(" ")
            
            if(dateString[0] > currentDateString[0]){
                forecastUnix = hour.dt
                forecast_Daily_Max = hour.main.temp_max
                forecast_Daily_Min = hour.main.temp_min
                forecast_Daily_Icon = hour.weather[0].icon
                forecast_Daily_Desc = hour.weather[0].main
                currentDateString[0] = dateString[0]
                displayWeekForecast()
            }

            
            
            
            console.log(dateString[0])

        
        })
        
    }
    catch(error){
        console.error(error)
    }
}

function displayCurrent(){
    const CITY_NAME = document.querySelector("#City-Name")
    CITY_NAME.textContent = city.toUpperCase()

    const FEEL_LIKE = document.querySelector("#feels-like")

    const WIND_SPEED = document.querySelector("#wind-speed")
    
    const WEATHER_ICON = document.querySelector("#weather-icon")

    WEATHER_ICON.src = `https://openweathermap.org/img/wn/${weather_icon}@2x.png`

    const WEATHER_DESC = document.querySelector("#weather-desc")

    WEATHER_DESC.textContent = currrent_desc.toUpperCase()
    
    current_temp.textContent = Math.ceil(current_temperture) + "°"

    FEEL_LIKE.textContent = Math.ceil(current_feels_like) + "°"

    WIND_SPEED.textContent = Math.round(currnet_windSpeed) + " mph"
}



function displayForecast(){
    const unixTimestamp = time; 
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const hours = date.getHours();


    const FORECAST_CARD = document.querySelector(".card-for")
    const FORECAST_CARD_ICON = document.querySelector(".forecast-icon")
    const FORECAST_TEMP = document.querySelector(".temp")

    let new_Forecast_card = document.createElement("div")
    let timeH1 = document.createElement("h1")
    let icon = document.createElement("img")
    let temp = document.createElement("h2");

    //Adding the classes to each new element
    new_Forecast_card.setAttribute("class", "card-for")
    timeH1.setAttribute("class","time")
    icon.setAttribute("class", "icon")
    temp.setAttribute("class","temp")

    

    //Setting the values from the forecast function

    timeH1.textContent = hours > 12 ? `${hours - 12} PM` : `${hours || 12} AM`;
    
    icon.src = `https://openweathermap.org/img/wn/${forecast_icon}@2x.png`
    temp.textContent = Math.ceil(forecast_temp) + "°"

    //adding them to the new forecast card
    new_Forecast_card.appendChild(timeH1)
    new_Forecast_card.appendChild(icon)
    new_Forecast_card.appendChild(temp)



    //Adding the card to the forecast div
    TODAY_FORECAST_CARDS.appendChild(new_Forecast_card)
    
}

function displayWeekForecast(){
    const DAILY_FORECAST_IMG = document.querySelector(".Daily-forecast-img")
    const DAILY_FORECAST_DESC = document.querySelector(".Daily-forecast-desc")

    const unixTimestamp = forecastUnix; 
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = daysOfWeek[date.getDay()];



    let newCard = document.createElement("div");
    newCard.setAttribute("class", "card-hor");
    
    let newh3Day = document.createElement("h3");
    newh3Day.setAttribute("class", "Daily-forecast-day");
    
    let desc = document.createElement("div");
    desc.setAttribute("class", "for");
    
    let descImg = document.createElement("img");
    descImg.setAttribute("class", "Daily-forecast-img");
    
    let descTxt = document.createElement("p");
    descTxt.setAttribute("class", "Daily-forecast-desc");
    
    let minMax = document.createElement("h3");
    minMax.setAttribute("class", "max-min");

    desc.appendChild(descImg)
    desc.appendChild(descTxt)

    descImg.src = `https://openweathermap.org/img/wn/${forecast_Daily_Icon}@2x.png`
    descTxt.textContent = forecast_Daily_Desc

    newh3Day.textContent = dayName
    minMax.textContent = Math.ceil(forecast_Daily_Max) + "/ " + Math.ceil(forecast_Daily_Min)
    
    newCard.appendChild(newh3Day)
    newCard.appendChild(desc)
    newCard.appendChild(minMax)

    DAILY_FORECAST_CARDS.appendChild(newCard)

    

    


}

