import React, { useState, useEffect } from 'react';
import { Search, Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Eye, Gauge, MapPin, Loader2 } from 'lucide-react';
import './WeatherApp.css';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Use relative URL for production (Docker), absolute for development
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? `/api/weather?city=${encodeURIComponent(cityName)}`
        : `http://localhost:9090/api/weather?city=${encodeURIComponent(cityName)}`;
      
      const response = await fetch(apiUrl);

      
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      data.is_day = new Date().getHours() >= 6 && new Date().getHours() < 18;

      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const getWeatherBackground = (condition, isDay) => {
  const c = condition.toLowerCase();

  if (!isDay) return "bg-night";

  if (c.includes("sun") || c.includes("clear")) return "bg-sunny";
  if (c.includes("cloud")) return "bg-cloudy";
  if (c.includes("rain") || c.includes("drizzle")) return "bg-rainy";
  if (c.includes("snow")) return "bg-snowy";

  return "bg-default";
};


  const getWeatherIcon = (condition) => {
    const conditionLower = condition?.toLowerCase() || '';
    
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <CloudRain className="weather-icon text-blue-400" />;
    } else if (conditionLower.includes('cloud')) {
      return <Cloud className="weather-icon text-gray-300" />;
    } else if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
      return <Sun className="weather-icon text-yellow-400" />;
    } else {
      return <Cloud className="weather-icon text-gray-300" />;
    }
  };

  // Load default city on component mount
  useEffect(() => {
    fetchWeather('Vijayawada');
  }, []);

  if (!weatherData && !loading) {
    return (
      <div className="weather-app">
        <div className="bento-grid">
          <div className="search-card glass">
            <h1 className="app-title text-gradient">Weather</h1>
            <form onSubmit={handleSubmit} className="search-form">
              <div className="search-input-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name..."
                  className="search-input"
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  className="search-button"
                  disabled={loading || !city.trim()}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                </button>
              </div>
            </form>
            {error && <p className="error-text">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-app">
      <div className="bento-grid">
        {/* Search Card */}
        <div className="search-card glass">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search city..."
                className="search-input"
                disabled={loading}
              />
              <button 
                type="submit" 
                className="search-button"
                disabled={loading || !city.trim()}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Go'}
              </button>
            </div>
          </form>
          {error && <p className="error-text">{error}</p>}
        </div>

        {weatherData && (
          <>
            {/* Main Temperature Card */}
            <div className="temperature-card glass">
              <div className={`temperature-card glass ${getWeatherBackground(weatherData.condition, weatherData.is_day)}`}>
              {/* Weather animations */}<div className="weather-animation-layer"></div>

              <div className="location-info">
                <MapPin className="location-icon" />
                <div>
                  <h2 className="city-name text-primary">{weatherData.city}</h2>
                  <p className="region-name text-secondary">{weatherData.region}</p>
                </div>
              </div>
              <div className="main-temp-section">
                {getWeatherIcon(weatherData.condition)}
                <div className="temperature-info">
                  <div className="main-temperature">
                    <span className="temp-value text-gradient">{Math.round(weatherData.temp)}</span>
                    <span className="temp-unit text-secondary">°C</span>
                  </div>
                  <p className="condition-text text-primary">{weatherData.condition}</p>
                </div>
              </div>
              </div>
            </div>

            {/* Feels Like Card */}
            <div className="feels-like-card glass">
              <div className="card-header">
                <Thermometer className="card-icon text-orange-400" />
                <span className="card-label text-secondary">Feels Like</span>
              </div>
              <div className="card-value text-primary">{Math.round(weatherData.feels_like)}°C</div>
            </div>

            {/* Wind Card */}
            <div className="wind-card glass">
              <div className="card-header">
                <Wind className="card-icon text-blue-400" />
                <span className="card-label text-secondary">Wind</span>
              </div>
              <div className="card-value text-primary">{weatherData.wind_speed}<span className="unit">km/h</span></div>
            </div>

            {/* Humidity Card */}
            <div className="humidity-card glass">
              <div className="card-header">
                <Droplets className="card-icon text-cyan-400" />
                <span className="card-label text-secondary">Humidity</span>
              </div>
              <div className="card-value text-primary">{weatherData.humidity}<span className="unit">%</span></div>
            </div>

            {/* Pressure Card */}
            <div className="pressure-card glass">
              <div className="card-header">
                <Gauge className="card-icon text-purple-400" />
                <span className="card-label text-secondary">Pressure</span>
              </div>
              <div className="card-value text-primary">{weatherData.pressure}<span className="unit">mb</span></div>
            </div>

            {/* Location Details Card */}
            <div className="location-card glass">
              <div className="card-header">
                <MapPin className="card-icon text-green-400" />
                <span className="card-label text-secondary">Location</span>
              </div>
              <div className="location-details">
                <p className="country-name text-primary">{weatherData.country}</p>
                <p className="region-detail text-secondary">{weatherData.region}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;