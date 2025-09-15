'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function Weather() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState({ lat: '', lon: '', city: '', state: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('current');
  const [farmingInsights, setFarmingInsights] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Default locations for quick access
  const quickLocations = [
    { name: 'Delhi', lat: 28.6139, lon: 77.2090, state: 'Delhi' },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777, state: 'Maharashtra' },
    { name: 'Bangalore', lat: 12.9716, lon: 77.5946, state: 'Karnataka' },
    { name: 'Chennai', lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu' },
    { name: 'Kolkata', lat: 22.5726, lon: 88.3639, state: 'West Bengal' },
    { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, state: 'Telangana' }
  ];

  // Generate farming insights based on current weather
  const generateFarmingInsights = useCallback((weatherData) => {
    const insights = {
      irrigation: '',
      fieldWork: '',
      diseaseRisk: '',
      generalAdvice: '',
      riskLevel: 'low'
    };

    // Irrigation advice
    if (weatherData.rainfall > 5) {
      insights.irrigation = 'Skip irrigation today due to adequate rainfall. Check soil moisture before next watering.';
    } else if (weatherData.humidity < 40) {
      insights.irrigation = 'Low humidity detected. Increase irrigation frequency to prevent crop stress.';
    } else {
      insights.irrigation = 'Normal irrigation schedule recommended. Monitor soil moisture levels.';
    }

    // Field work recommendations
    if (weatherData.rainfall > 10) {
      insights.fieldWork = 'Avoid heavy field operations due to wet conditions. Risk of soil compaction.';
      insights.riskLevel = 'high';
    } else if (weatherData.wind_speed > 15) {
      insights.fieldWork = 'High wind speed. Postpone spraying operations and secure loose materials.';
      insights.riskLevel = 'medium';
    } else {
      insights.fieldWork = 'Good conditions for field operations. Ideal for planting, harvesting, or maintenance.';
    }

    // Disease risk assessment
    if (weatherData.humidity > 80 && weatherData.temperature > 20) {
      insights.diseaseRisk = 'High humidity and warm temperature increase fungal disease risk. Monitor crops closely.';
      insights.riskLevel = 'high';
    } else if (weatherData.humidity > 70) {
      insights.diseaseRisk = 'Moderate disease risk. Consider preventive fungicide application if needed.';
      insights.riskLevel = 'medium';
    } else {
      insights.diseaseRisk = 'Low disease risk. Continue regular monitoring practices.';
    }

    // General farming advice
    if (weatherData.temperature > 35) {
      insights.generalAdvice = 'High temperature alert! Provide shade for livestock and increase water supply for crops.';
    } else if (weatherData.temperature < 10) {
      insights.generalAdvice = 'Frost risk warning! Protect sensitive crops and ensure livestock have warm shelter.';
    } else {
      insights.generalAdvice = 'Favorable weather conditions for most farming activities.';
    }

    setFarmingInsights(insights);
  }, []);

  // Generate mock 7-day forecast
  const generateMockForecast = useCallback((currentData) => {
    const mockForecast = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      mockForecast.push({
        day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-IN', { weekday: 'short' }),
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        temperature: {
          max: currentData.temperature + (Math.random() * 6 - 3),
          min: currentData.temperature - (Math.random() * 5 + 5)
        },
        humidity: Math.max(0, Math.min(100, currentData.humidity + (Math.random() * 20 - 10))),
        rainfall: Math.random() > 0.7 ? Math.random() * 15 : 0,
        windSpeed: Math.max(0, currentData.wind_speed + (Math.random() * 4 - 2)),
        condition: i === 0 ? currentData.weather_condition : ['Clear', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        icon: i === 0 ? getWeatherIcon(currentData.weather_condition) : getWeatherIcon(['Clear', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)])
      });
    }
    
    setForecast(mockForecast);
  }, []);

  // Get weather icon based on condition
  const getWeatherIcon = useCallback((condition) => {
    const icons = {
      'Clear': '☀️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Rain': '🌧️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Haze': '🌫️',
      'default': '🌤️'
    };
    return icons[condition] || icons.default;
  }, []);

  // Fetch weather data from your API
  const fetchWeatherData = useCallback(async (lat, lon) => {
    // Validate coordinates before making API call
    if (!lat || !lon || lat === 'undefined' || lon === 'undefined') {
      setError('Invalid coordinates provided');
      setLoading(false);
      return;
    }

    // Ensure coordinates are numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      setError('Invalid coordinate format');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching weather for: ${latitude}, ${longitude}`);
      const response = await fetch(`/api/weather/current?lat=${latitude}&lon=${longitude}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Weather API response:', data);
      
      if (data.success) {
        setCurrentWeather(data.data);
        setLocation(prev => ({
          ...prev,
          lat: latitude,
          lon: longitude,
          city: data.location.city,
          state: data.location.country
        }));
        
        // Generate farming insights based on weather data
        generateFarmingInsights(data.data);
        
        // Generate mock forecast data (in real app, you'd call forecast API)
        generateMockForecast(data.data);
      } else {
        setError(data.message || 'Failed to fetch weather data');
      }
    } catch (error) {
      console.error('Weather API Error:', error);
      setError('Error fetching weather data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [generateFarmingInsights, generateMockForecast]);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Got user location:', latitude, longitude);
          setLocation(prev => ({ ...prev, lat: latitude, lon: longitude }));
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to get your location. Please enter coordinates manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, [fetchWeatherData]);

  // Load quick location
  const loadQuickLocation = useCallback((quickLoc) => {
    console.log('Loading quick location:', quickLoc);
    setLocation({
      lat: quickLoc.lat,
      lon: quickLoc.lon,
      city: quickLoc.name,
      state: quickLoc.state
    });
    fetchWeatherData(quickLoc.lat, quickLoc.lon);
  }, [fetchWeatherData]);

  // Handle manual location input
  const handleLocationSubmit = useCallback((e) => {
    e.preventDefault();
    if (location.lat && location.lon) {
      fetchWeatherData(parseFloat(location.lat), parseFloat(location.lon));
    } else {
      setError('Please enter both latitude and longitude');
    }
  }, [location.lat, location.lon, fetchWeatherData]);

  // Get risk level color
  const getRiskColor = useCallback((level) => {
    switch(level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }, []);

  // FIXED: Initialize with default location only after component mounts
  useEffect(() => {
    if (!initialized) {
      console.log('Initializing weather page with Delhi as default');
      setInitialized(true);
      // Add a small delay to ensure everything is ready
      setTimeout(() => {
        loadQuickLocation(quickLocations[0]);
      }, 100);
    }
  }, [initialized, loadQuickLocation, quickLocations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Agricultural Weather Forecast</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get detailed weather insights tailored for farming operations and agricultural planning
          </p>
        </div>

        {/* Location Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Manual Location Input */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Location</h3>
              <form onSubmit={handleLocationSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={location.lat}
                      onChange={(e) => setLocation(prev => ({ ...prev, lat: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 28.6139"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={location.lon}
                      onChange={(e) => setLocation(prev => ({ ...prev, lon: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 77.2090"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading || !location.lat || !location.lon}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : 'Get Weather'}
                  </button>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Use My Location</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Locations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Locations</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickLocations.map((quickLoc, index) => (
                  <button
                    key={index}
                    onClick={() => loadQuickLocation(quickLoc)}
                    disabled={loading}
                    className={`p-3 text-left rounded-lg border transition duration-300 disabled:opacity-50 ${
                      location.city === quickLoc.name
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{quickLoc.name}</div>
                    <div className="text-sm text-gray-500">{quickLoc.state}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-700">Loading weather data...</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Main Weather Content - Rest of your existing JSX goes here */}
        {currentWeather && (
          <>
            {/* Current Weather Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Current Weather</h2>
                  <p className="text-gray-600">{location.city}, {location.state}</p>
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-6xl mb-2">{getWeatherIcon(currentWeather.weather_condition)}</div>
                  <div className="text-4xl font-bold text-gray-900">{Math.round(currentWeather.temperature)}°C</div>
                  <div className="text-gray-600 capitalize">{currentWeather.description}</div>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-2xl mb-2">💧</div>
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="text-lg font-bold text-blue-600">{currentWeather.humidity}%</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <div className="text-2xl mb-2">🌧️</div>
                  <div className="text-sm text-gray-600">Rainfall</div>
                  <div className="text-lg font-bold text-green-600">{currentWeather.rainfall || 0} mm</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl text-center">
                  <div className="text-2xl mb-2">💨</div>
                  <div className="text-sm text-gray-600">Wind Speed</div>
                  <div className="text-lg font-bold text-purple-600">{Math.round(currentWeather.wind_speed)} km/h</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm text-gray-600">Pressure</div>
                  <div className="text-lg font-bold text-orange-600">{currentWeather.pressure} hPa</div>
                </div>
                <div className="bg-teal-50 p-4 rounded-xl text-center">
                  <div className="text-2xl mb-2">👁️</div>
                  <div className="text-sm text-gray-600">Visibility</div>
                  <div className="text-lg font-bold text-teal-600">{Math.round(currentWeather.visibility/1000)} km</div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl text-center">
                  <div className="text-2xl mb-2">🌡️</div>
                  <div className="text-sm text-gray-600">Feels Like</div>
                  <div className="text-lg font-bold text-indigo-600">{Math.round(currentWeather.temperature + 2)}°C</div>
                </div>
              </div>
            </div>

            {/* Farming Insights */}
            {farmingInsights && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Farming Insights</h2>
                  <div className={`px-4 py-2 rounded-full border text-sm font-medium ${getRiskColor(farmingInsights.riskLevel)}`}>
                    {farmingInsights.riskLevel.toUpperCase()} RISK
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl">💧</span>
                        <h3 className="font-semibold text-blue-800">Irrigation Advice</h3>
                      </div>
                      <p className="text-blue-700 text-sm">{farmingInsights.irrigation}</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl">🚜</span>
                        <h3 className="font-semibold text-green-800">Field Work</h3>
                      </div>
                      <p className="text-green-700 text-sm">{farmingInsights.fieldWork}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl">🦠</span>
                        <h3 className="font-semibold text-red-800">Disease Risk</h3>
                      </div>
                      <p className="text-red-700 text-sm">{farmingInsights.diseaseRisk}</p>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl">💡</span>
                        <h3 className="font-semibold text-yellow-800">General Advice</h3>
                      </div>
                      <p className="text-yellow-700 text-sm">{farmingInsights.generalAdvice}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7-Day Forecast */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7-Day Forecast</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {forecast.map((day, index) => (
                  <div key={index} className={`p-4 rounded-xl text-center ${index === 0 ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'}`}>
                    <div className="font-semibold text-gray-900 mb-1">{day.day}</div>
                    <div className="text-sm text-gray-600 mb-3">{day.date}</div>
                    <div className="text-3xl mb-3">{day.icon}</div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-lg font-bold text-gray-900">{Math.round(day.temperature.max)}°</div>
                        <div className="text-sm text-gray-500">{Math.round(day.temperature.min)}°</div>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center justify-center space-x-1">
                          <span>💧</span>
                          <span>{Math.round(day.humidity)}%</span>
                        </div>
                        {day.rainfall > 0 && (
                          <div className="flex items-center justify-center space-x-1">
                            <span>🌧️</span>
                            <span>{Math.round(day.rainfall)}mm</span>
                          </div>
                        )}
                        <div className="flex items-center justify-center space-x-1">
                          <span>💨</span>
                          <span>{Math.round(day.windSpeed)}km/h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agricultural Calendar Suggestions */}
            <div className="mt-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">📅</div>
                <h2 className="text-xl font-bold text-gray-900">{"This Week's Agricultural Calendar"}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Recommended Activities</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Monitor soil moisture levels</li>
                    <li>• Check for pest activity</li>
                    <li>• Adjust irrigation schedules</li>
                    <li>• Plan fertilizer applications</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Weather Alerts</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {currentWeather.temperature > 35 && <li>• Heat stress warning for crops</li>}
                    {currentWeather.humidity > 80 && <li>• High humidity - disease risk</li>}
                    {currentWeather.wind_speed > 15 && <li>• Strong winds - secure equipment</li>}
                    {currentWeather.rainfall === 0 && <li>• No rainfall - monitor irrigation</li>}
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Seasonal Tips</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Prepare for seasonal crop rotation</li>
                    <li>• Review market prices for planning</li>
                    <li>• Maintain farming equipment</li>
                    <li>• Plan next season's seed procurement</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
