// src/components/weather/WeatherDialog.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, Droplets, Wind, Thermometer, Eye, X } from 'lucide-react';
import { mapWeatherCodeToIcon } from '../../services/weatherService';

const WeatherDialog = ({ weather, onClose }) => {
  const { t, i18n } = useTranslation('weather');
  if (!weather) return null;

  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const description = weather.weather[0]?.description || '';
  const humidity = weather.main.humidity;
  const windSpeed = Math.round(weather.wind.speed * 3.6);
  const visibility = Math.round(weather.visibility / 1000);
  const weatherCode = weather.weather[0]?.id;
  const now = Date.now() / 1000;
  const isNight = now < weather.sys.sunrise || now > weather.sys.sunset;
  const iconType = mapWeatherCodeToIcon(weatherCode, isNight);

  const formatTime = (timestamp) => new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunrise = formatTime(weather.sys.sunrise);
  const sunset = formatTime(weather.sys.sunset);

  const getWeatherIcon = () => {
    const props = { className: `weather-dialog-icon ${iconType}`, size: 48 };
    switch (iconType) {
      case 'sun': return <Sun {...props} />;
      case 'moon': return <Moon {...props} />;
      case 'cloudy': return <Cloud {...props} />;
      case 'rain': return <CloudRain {...props} />;
      case 'snow': return <CloudSnow {...props} />;
      case 'storm': return <CloudLightning {...props} />;
      default: return isNight ? <Moon {...props} /> : <Sun {...props} />;
    }
  };

  return (
    <div className="weather-dialog-overlay" onClick={onClose}>
      <div className="weather-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="weather-dialog-close" onClick={onClose}><X size={20} /></button>
        <div className="weather-dialog-header">
          <h2 className="weather-dialog-location">{weather.name}</h2>
          <p className="weather-dialog-date">{new Date().toLocaleDateString(i18n.language, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="weather-dialog-main">
          <div className="weather-dialog-icon-wrapper">{getWeatherIcon()}</div>
          <div className="weather-dialog-temp">
            <span className="weather-dialog-temp-value">{temp}°C</span>
            <span className="weather-dialog-desc">{description}</span>
          </div>
        </div>
        <div className="weather-dialog-details">
          <div className="weather-dialog-detail"><Thermometer size={16} /><span className="weather-dialog-detail-label">{t('weatherDialog.feelsLike', 'Feels like')}</span><span className="weather-dialog-detail-value">{feelsLike}°C</span></div>
          <div className="weather-dialog-detail"><Droplets size={16} /><span className="weather-dialog-detail-label">{t('weatherDialog.humidity', 'Humidity')}</span><span className="weather-dialog-detail-value">{humidity}%</span></div>
          <div className="weather-dialog-detail"><Wind size={16} /><span className="weather-dialog-detail-label">{t('weatherDialog.wind', 'Wind')}</span><span className="weather-dialog-detail-value">{windSpeed} km/h</span></div>
          <div className="weather-dialog-detail"><Eye size={16} /><span className="weather-dialog-detail-label">{t('weatherDialog.visibility', 'Visibility')}</span><span className="weather-dialog-detail-value">{visibility} km</span></div>
        </div>
        <div className="weather-dialog-sun-times">
          <div className="weather-dialog-sun-time"><Sun size={16} /><span className="weather-dialog-sun-label">{t('weatherDialog.sunrise', 'Sunrise')}</span><span className="weather-dialog-sun-value">{sunrise}</span></div>
          <div className="weather-dialog-sun-time"><Moon size={16} /><span className="weather-dialog-sun-label">{t('weatherDialog.sunset', 'Sunset')}</span><span className="weather-dialog-sun-value">{sunset}</span></div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDialog;