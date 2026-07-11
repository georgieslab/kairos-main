// src/components/weather/WeatherWidget.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getWeatherByCity, mapWeatherCodeToIcon } from '../../services/weatherService';
import {
  Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, Loader
} from 'lucide-react';
import WeatherDialog from './WeatherDialog';

const WeatherWidget = ({ city, className, onWeatherData }) => {
  const { t } = useTranslation('weather');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
        if (onWeatherData) onWeatherData(data);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(t('weatherWidget.unavailable', 'Weather unavailable'));
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city, onWeatherData]);

  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="weather-icon cloud" size={18} />;
    const weatherCode = weather.weather[0]?.id;
    const now = Date.now() / 1000;
    const isNight = now < weather.sys.sunrise || now > weather.sys.sunset;
    const iconType = mapWeatherCodeToIcon(weatherCode, isNight);
    const iconProps = { className: `weather-icon ${iconType}`, size: 18 };
    switch (iconType) {
      case 'sun': return <Sun {...iconProps} />;
      case 'moon': return <Moon {...iconProps} />;
      case 'cloudy': return <Cloud {...iconProps} />;
      case 'rain': return <CloudRain {...iconProps} />;
      case 'snow': return <CloudSnow {...iconProps} />;
      case 'storm': return <CloudLightning {...iconProps} />;
      default: return isNight ? <Moon {...iconProps} /> : <Sun {...iconProps} />;
    }
  };

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
        <Cloud className="weather-icon cloud" size={18} />
      </div>
    );
  }

  const temp = Math.round(weather.main.temp);
  const description = weather.weather[0]?.description || '';

  return (
    <>
      <div 
        className={`weather-widget ${className || ''}`}
        onClick={() => setDialogOpen(true)}
        title={description}
      >
        <div className="weather-icon-wrapper">{getWeatherIcon()}</div>
        <span className="weather-temp">{temp}°</span>
      </div>
      {dialogOpen && (
        <WeatherDialog weather={weather} onClose={() => setDialogOpen(false)} />
      )}
    </>
  );
};

export default WeatherWidget;