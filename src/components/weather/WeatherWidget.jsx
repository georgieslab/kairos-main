// src/components/weather/WeatherWidget.jsx
import React, { useState, useEffect } from 'react';
import { getWeatherByCity, mapWeatherCodeToIcon } from '../../services/weatherService';
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  Loader,
  AlertTriangle
} from 'lucide-react';

const WeatherWidget = ({ city, className, onWeatherData }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const data = await getWeatherByCity(city);
        setWeather(data);
        
        // Pass weather data to parent component if callback provided
        if (onWeatherData) onWeatherData(data);
      } catch (err) {
        console.error('Error in weather widget:', err);
        setError('Could not load weather');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
    
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [city, onWeatherData]);
  
  if (loading) {
    return (
      <div className={`weather-widget loading ${className || ''}`}>
        <Loader className="weather-icon loading" size={18} />
      </div>
    );
  }
  
  if (error || !weather) {
    return (
      <div className={`weather-widget error ${className || ''}`}>
        <Cloud className="weather-icon" size={18} />
      </div>
    );
  }
  
  const temp = Math.round(weather.main.temp);
  const description = weather.weather[0]?.description || '';
  const weatherCode = weather.weather[0]?.id;
  
  // Check if it's night (based on sunset/sunrise)
  const now = Date.now() / 1000; // convert to seconds
  const isNight = now < weather.sys.sunrise || now > weather.sys.sunset;
  
  // Map weather code to our icon set
  const iconType = mapWeatherCodeToIcon(weatherCode, isNight);
  
  // Render the appropriate weather icon
  const getWeatherIcon = () => {
    switch (iconType) {
      case 'sun':
        return <Sun className="weather-icon sun" size={18} />;
      case 'moon':
        return <Moon className="weather-icon moon" size={18} />;
      case 'cloudy':
        return <Cloud className="weather-icon cloud" size={18} />;
      case 'rain':
        return <CloudRain className="weather-icon rain" size={18} />;
      case 'snow':
        return <CloudSnow className="weather-icon snow" size={18} />;
      case 'storm':
        return <CloudLightning className="weather-icon storm" size={18} />;
      default:
        return isNight ? 
          <Moon className="weather-icon moon" size={18} /> : 
          <Sun className="weather-icon sun" size={18} />;
    }
  };
  
  return (
    <div className={`weather-widget ${className || ''}`} title={description}>
      <div className="weather-icon-wrapper">
        {getWeatherIcon()}
      </div>
      <span className="weather-temp">{temp}°</span>
    </div>
  );
};

export default WeatherWidget;