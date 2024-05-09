import React, { useState, useEffect } from 'react';
import "./App.css";
import "./index.css"
import WeatherChart from './components/Chart';

const API_URL = 'https://api.open-meteo.com/v1/gfs'; 

interface WeatherData {
  temperature: number;
  weathercode: number;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');
  const [isGeolocating, setIsGeolocating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchTerm) return;

      try {
        let latitude = 0;
        let longitude = 0;

        if (navigator.geolocation) {
          setIsGeolocating(true);
          const success = (position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            setIsGeolocating(false);
            fetchDataWithCoords(latitude, longitude); 
          };

          const error = () => {
            setIsGeolocating(false);
            setError('Geolocation failed. Enter city or region instead.');
          };

          navigator.geolocation.getCurrentPosition(success, error);
        } else {
          setError('Geolocation not supported. Enter city or region instead.');
        }
      } catch (error) {
        setError('Failed to fetch weather data.');
      }
    };

    const fetchDataWithCoords = async (lat: number, lon: number) => {
      const response = await fetch(
        `${API_URL}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m:PT1H&current_weather=true`
      );
      const data = await response.json();
      if (data.hasOwnProperty('hourly')) {
        setWeatherData({
          temperature: data.hourly.temperature_2m[0],
          weathercode: data.current_weather.weathercode,
        });
        setError('');
      } else {
        setError('Location not found.');
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <WeatherChart/>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city or region (if geolocation fails)"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>
      {isGeolocating && <p>Geolocating...</p>}
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div>
          <h2>{searchTerm}</h2>
          <p>Temperature: {Math.round(weatherData.temperature)}°C</p>
        </div>
      )}
    </div>
  );
}

export default App;
