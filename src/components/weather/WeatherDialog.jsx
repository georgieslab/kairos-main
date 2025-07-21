// src/components/weather/WeatherDialog.jsx
import React from 'react';
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  Droplets,
  Wind,
  Thermometer,
  Eye,
  X
} from 'lucide-react';
import { mapWeatherCodeToIcon } from '../../services/weatherService';

const WeatherDialog = ({ weather, onClose }) => {
  if (!weather) return null;
  
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const description = weather.weather[0]?.description || '';
  const humidity = weather.main.humidity;
  const windSpeed = Math.round(weather.wind.speed * 3.6); // Convert m/s to km/h
  const visibility = Math.round(weather.visibility / 1000); // Convert m to km
  const weatherCode = weather.weather[0]?.id;
  
  // Check if it's night (based on sunset/sunrise)
  const now = Date.now() / 1000; // convert to seconds
  const isNight = now < weather.sys.sunrise || now > weather.sys.sunset;
  
  // Format sunrise and sunset times
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const sunrise = formatTime(weather.sys.sunrise);
  const sunset = formatTime(weather.sys.sunset);
  
  // Map weather code to our icon set
  const iconType = mapWeatherCodeToIcon(weatherCode, isNight);
  
  // Render the appropriate weather icon
  const getWeatherIcon = () => {
    switch (iconType) {
      case 'sun':
        return <Sun className="weather-dialog-icon sun" size={48} />;
      case 'moon':
        return <Moon className="weather-dialog-icon moon" size={48} />;
      case 'cloudy':
        return <Cloud className="weather-dialog-icon cloud" size={48} />;
      case 'rain':
        return <CloudRain className="weather-dialog-icon rain" size={48} />;
      case 'snow':
        return <CloudSnow className="weather-dialog-icon snow" size={48} />;
      case 'storm':
        return <CloudLightning className="weather-dialog-icon storm" size={48} />;
      default:
        return isNight ? 
          <Moon className="weather-dialog-icon moon" size={48} /> : 
          <Sun className="weather-dialog-icon sun" size={48} />;
    }
  };
  
  return (
    <div className="weather-dialog-overlay" onClick={onClose}>
      <div className="weather-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="weather-dialog-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="weather-dialog-header">
          <h2 className="weather-dialog-location">{weather.name}</h2>
          <p className="weather-dialog-date">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="weather-dialog-main">
          <div className="weather-dialog-icon-wrapper">
            {getWeatherIcon()}
          </div>
          <div className="weather-dialog-temp">
            <span className="weather-dialog-temp-value">{temp}°C</span>
            <span className="weather-dialog-desc">{description}</span>
          </div>
        </div>
        
        <div className="weather-dialog-details">
          <div className="weather-dialog-detail">
            <Thermometer size={16} />
            <span className="weather-dialog-detail-label">Feels like</span>
            <span className="weather-dialog-detail-value">{feelsLike}°C</span>
          </div>
          
          <div className="weather-dialog-detail">
            <Droplets size={16} />
            <span className="weather-dialog-detail-label">Humidity</span>
            <span className="weather-dialog-detail-value">{humidity}%</span>
          </div>
          
          <div className="weather-dialog-detail">
            <Wind size={16} />
            <span className="weather-dialog-detail-label">Wind</span>
            <span className="weather-dialog-detail-value">{windSpeed} km/h</span>
          </div>
          
          <div className="weather-dialog-detail">
            <Eye size={16} />
            <span className="weather-dialog-detail-label">Visibility</span>
            <span className="weather-dialog-detail-value">{visibility} km</span>
          </div>
        </div>
        
        <div className="weather-dialog-sun-times">
          <div className="weather-dialog-sun-time">
            <Sun size={16} />
            <span className="weather-dialog-sun-label">Sunrise</span>
            <span className="weather-dialog-sun-value">{sunrise}</span>
          </div>
          
          <div className="weather-dialog-sun-time">
            <Moon size={16} />
            <span className="weather-dialog-sun-label">Sunset</span>
            <span className="weather-dialog-sun-value">{sunset}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDialog;