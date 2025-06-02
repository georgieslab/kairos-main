// src/services/weatherService.js
const WEATHER_API_KEY = '413a430d77f66b28b754d47d8b114470';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Cache weather data to reduce API calls
const weatherCache = {
  data: {},
  timestamp: {},
  // Cache validity in minutes
  CACHE_DURATION: 30
};

export const getWeatherByCity = async (city) => {
  if (!city) {
    throw new Error('City is required');
  }
  
  // Check if we have cached data and if it's still valid
  const now = Date.now();
  if (
    weatherCache.data[city] &&
    weatherCache.timestamp[city] &&
    now - weatherCache.timestamp[city] < weatherCache.CACHE_DURATION * 60 * 1000
  ) {
    return weatherCache.data[city];
  }
  
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    weatherCache.data[city] = data;
    weatherCache.timestamp[city] = now;
    
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Convert weather code to app-specific icon
export const mapWeatherCodeToIcon = (weatherCode, isNight) => {
  // Weather codes from OpenWeatherMap API
  // https://openweathermap.org/weather-conditions
  
  // Group codes into categories that match our icon set
  const thunderstorm = [200, 201, 202, 210, 211, 212, 221, 230, 231, 232];
  const drizzle = [300, 301, 302, 310, 311, 312, 313, 314, 321];
  const rain = [500, 501, 502, 503, 504, 511, 520, 521, 522, 531];
  const snow = [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622];
  const atmosphere = [701, 711, 721, 731, 741, 751, 761, 762, 771, 781];
  const clear = [800];
  const clouds = [801, 802, 803, 804];
  
  if (thunderstorm.includes(weatherCode)) return 'storm';
  if (drizzle.includes(weatherCode)) return 'rain';
  if (rain.includes(weatherCode)) return 'rain';
  if (snow.includes(weatherCode)) return 'snow';
  if (atmosphere.includes(weatherCode)) return 'cloudy';
  if (clear.includes(weatherCode)) return isNight ? 'moon' : 'sun';
  if (clouds.includes(weatherCode)) return 'cloudy';
  
  // Default to clear if we can't map it
  return isNight ? 'moon' : 'sun';
};