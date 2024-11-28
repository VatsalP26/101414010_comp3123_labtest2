import React, { useState, useEffect } from "react";
import axios from "axios";
import './Weather.css';

const Weather = () => {
  const [city, setCity] = useState("Toronto");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "42d62c6ff81bcccce8bb2a7f12b2f8d1"; 

  useEffect(() => {
    if (city) {
      fetchWeatherData(city);
      fetchForecastData(city);
    }
  }, [city]);

  const fetchWeatherData = async (city) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      setWeatherData(response.data);
      setError("");
    } catch (err) {
      setError("Unable to fetch weather data. Please check the city name.");
    } finally {
      setLoading(false);
    }
  };

  const fetchForecastData = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
      );
      setForecastData(response.data);
    } catch (err) {
      setError("Unable to fetch forecast data.");
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeatherData(city);
      fetchForecastData(city);
    } else {
      setError("Please enter a valid city name.");
    }
  };

  return (
    <div className="weather-app">
      {/* Heading */}
      <h1 className="app-heading">Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name (e.g., Toronto)"
          aria-label="City name"
        />
        <button onClick={handleSearch} aria-label="Search weather">Search</button>
      </div>
      
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      
      {weatherData && (
        <div className="weather-card">
          <h2>{weatherData.name}</h2>
          <p>Temperature: {(weatherData.main.temp - 273.15).toFixed(2)}°C</p>
          <p>Condition: {weatherData?.weather?.[0]?.description || "N/A"}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {(weatherData.wind.speed * 3.6).toFixed(2)} km/h</p>
          <div className="weather-icon">
            <img
              src={`http://openweathermap.org/img/wn/${weatherData?.weather?.[0]?.icon}@2x.png`}
              alt="Weather icon"
            />
          </div>
        </div>
      )}

      {forecastData && (
        <div className="forecast-container">
          <h3>5-Day Forecast</h3>
          <div className="forecast-card-container">
            {forecastData.list.slice(0, 5).map((forecast, index) => (
              <div key={index} className="forecast-card">
                <p>{new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                <img
                  src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                  alt="Weather icon"
                />
                <p>{(forecast.main.temp - 273.15).toFixed(2)}°C</p>
                <p>{forecast.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!weatherData && !error && <p>Enter a city to see the weather!</p>}
    </div>
  );
};

export default Weather;
