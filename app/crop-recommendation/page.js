'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CropRecommendation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [formData, setFormData] = useState({
    location: { latitude: '', longitude: '', city: '', state: '' },
    soilData: { nitrogen: '', phosphorus: '', potassium: '', ph: '', organic_matter: '', moisture: '' },
    climateData: { temperature: '', humidity: '', rainfall: '', sunlight_hours: '' },
    marketData: { season: 'Kharif', farm_size: '', budget: '' }
  });

  // Auto-fetch weather data when location is provided
  useEffect(() => {
    if (formData.location.latitude && formData.location.longitude) {
      fetchWeatherData();
    }
  }, [formData.location.latitude, formData.location.longitude]);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `/api/weather/current?lat=${formData.location.latitude}&lon=${formData.location.longitude}`
      );
      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          climateData: {
            ...prev.climateData,
            temperature: data.data.temperature,
            humidity: data.data.humidity,
            rainfall: data.data.rainfall || 0
          },
          location: {
            ...prev.location,
            city: data.location.city
          }
        }));
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/crop/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user_' + Date.now(), // Generate temporary user ID
          ...formData
        })
      });

      const result = await response.json();
      if (result.success) {
        setRecommendations(result.data.recommendations);
        setCurrentStep(5); // Move to results step
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        handleInputChange('location', 'latitude', position.coords.latitude);
        handleInputChange('location', 'longitude', position.coords.longitude);
      });
    } else {
      alert('Geolocation not supported by this browser');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${currentStep >= step ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-12 h-1 mx-2 ${currentStep > step ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-gray-600">
            Step {currentStep} of 5: {
              ['Location', 'Soil Analysis', 'Climate Data', 'Farm Details', 'Recommendations'][currentStep - 1]
            }
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Location */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location.latitude}
                    onChange={(e) => handleInputChange('location', 'latitude', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 28.6139"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location.longitude}
                    onChange={(e) => handleInputChange('location', 'longitude', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 77.2090"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.location.city}
                    onChange={(e) => handleInputChange('location', 'city', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.location.state}
                    onChange={(e) => handleInputChange('location', 'state', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your state"
                  />
                </div>
              </div>
              <button
                onClick={getCurrentLocation}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Use Current Location
              </button>
            </div>
          )}

          {/* Step 2: Soil Data */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Soil Analysis Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nitrogen (N) <span className="text-gray-500">(kg/ha)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.soilData.nitrogen}
                    onChange={(e) => handleInputChange('soilData', 'nitrogen', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 45"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phosphorus (P) <span className="text-gray-500">(kg/ha)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.soilData.phosphorus}
                    onChange={(e) => handleInputChange('soilData', 'phosphorus', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Potassium (K) <span className="text-gray-500">(kg/ha)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.soilData.potassium}
                    onChange={(e) => handleInputChange('soilData', 'potassium', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 180"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    pH Level
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.soilData.ph}
                    onChange={(e) => handleInputChange('soilData', 'ph', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 6.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organic Matter <span className="text-gray-500">(%)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.soilData.organic_matter}
                    onChange={(e) => handleInputChange('soilData', 'organic_matter', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moisture Content <span className="text-gray-500">(%)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.soilData.moisture}
                    onChange={(e) => handleInputChange('soilData', 'moisture', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 15.0"
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Get your soil tested at a local agricultural laboratory for accurate NPK and pH values.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Climate Data */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Climate Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature <span className="text-gray-500">(°C)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.climateData.temperature}
                    onChange={(e) => handleInputChange('climateData', 'temperature', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 28"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Humidity <span className="text-gray-500">(%)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.climateData.humidity}
                    onChange={(e) => handleInputChange('climateData', 'humidity', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 65"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Rainfall <span className="text-gray-500">(mm)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.climateData.rainfall}
                    onChange={(e) => handleInputChange('climateData', 'rainfall', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sunlight Hours <span className="text-gray-500">(per day)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.climateData.sunlight_hours}
                    onChange={(e) => handleInputChange('climateData', 'sunlight_hours', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 8"
                  />
                </div>
              </div>
              {formData.location.latitude && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Auto-filled:</strong> Temperature and humidity data has been automatically fetched for your location.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Market Data */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Farm & Market Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Growing Season
                  </label>
                  <select
                    value={formData.marketData.season}
                    onChange={(e) => handleInputChange('marketData', 'season', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Kharif">Kharif (June-October)</option>
                    <option value="Rabi">Rabi (November-April)</option>
                    <option value="Zaid">Zaid (March-June)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Size <span className="text-gray-500">(acres)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.marketData.farm_size}
                    onChange={(e) => handleInputChange('marketData', 'farm_size', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Budget <span className="text-gray-500">(₹)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.marketData.budget}
                    onChange={(e) => handleInputChange('marketData', 'budget', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 50000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Recommendations */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Crop Recommendations</h2>
              {recommendations.length > 0 ? (
                <div className="space-y-6">
                  {recommendations.map((crop, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{crop.crop_name}</h3>
                          <p className="text-green-600 font-semibold">Confidence: {crop.confidence_score}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">Expected Yield</p>
                          <p className="text-lg font-bold">{crop.expected_yield} tons</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Market Price</p>
                          <p className="font-bold text-green-600">₹{crop.market_price}/quintal</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Profit Potential</p>
                          <p className="font-bold text-green-600">₹{Math.round(crop.profit_margin)}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Season</p>
                          <p className="font-bold">{crop.season_suitability.join(', ')}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Growing Tips:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {crop.growing_tips.map((tip, tipIndex) => (
                            <li key={tipIndex}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No recommendations available. Please check your input data.</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && currentStep < 5 && (
              <button
                onClick={handlePrevStep}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Previous
              </button>
            )}
            
            {currentStep < 4 && (
              <button
                onClick={handleNextStep}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 ml-auto"
              >
                Next
              </button>
            )}
            
            {currentStep === 4 && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 ml-auto disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Get Recommendations'}
              </button>
            )}
            
            {currentStep === 5 && (
              <div className="flex space-x-4 ml-auto">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setRecommendations([]);
                    setFormData({
                      location: { latitude: '', longitude: '', city: '', state: '' },
                      soilData: { nitrogen: '', phosphorus: '', potassium: '', ph: '', organic_matter: '', moisture: '' },
                      climateData: { temperature: '', humidity: '', rainfall: '', sunlight_hours: '' },
                      marketData: { season: 'Kharif', farm_size: '', budget: '' }
                    });
                  }}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  New Analysis
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Print Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
