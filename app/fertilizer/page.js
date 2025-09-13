'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Fertilizer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [formData, setFormData] = useState({
    cropInfo: {
      crop_type: '',
      crop_variety: '',
      growth_stage: '',
      cultivation_area: ''
    },
    soilData: {
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      ph: '',
      organic_matter: '',
      soil_type: ''
    },
    farmDetails: {
      irrigation_type: '',
      previous_fertilizer: '',
      budget_per_acre: '',
      application_method: ''
    }
  });

  const cropOptions = [
    'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Tomato', 'Potato', 'Onion', 
    'Soybean', 'Barley', 'Groundnut', 'Sunflower', 'Mustard', 'Chilli', 'Brinjal'
  ];

  const growthStages = [
    'Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity'
  ];

  const soilTypes = [
    'Sandy', 'Clay', 'Loam', 'Sandy Loam', 'Clay Loam', 'Silt', 'Peaty', 'Chalky'
  ];

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
      // Mock API call - replace with actual API endpoint
      const response = await fetch('/api/fertilizer/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user_' + Date.now(),
          ...formData
        })
      });

      if (response.ok) {
        const result = await response.json();
        setRecommendations(result.data.recommendations || mockRecommendations);
        setCurrentStep(4);
      } else {
        // Use mock data if API fails
        setRecommendations(mockRecommendations);
        setCurrentStep(4);
      }
    } catch (error) {
      console.error('Fertilizer recommendation error:', error);
      // Use mock data as fallback
      setRecommendations(mockRecommendations);
      setCurrentStep(4);
    } finally {
      setLoading(false);
    }
  };

  // Mock recommendations for demonstration
  const mockRecommendations = [
    {
      fertilizer_name: 'NPK 20:20:20',
      application_rate: '25 kg/acre',
      application_timing: 'Basal application at sowing',
      cost_per_acre: '₹1,200',
      nutrient_content: { N: '20%', P: '20%', K: '20%' },
      benefits: ['Balanced nutrition', 'Quick nutrient release', 'Suitable for all crops'],
      application_method: 'Broadcasting and incorporation'
    },
    {
      fertilizer_name: 'Urea',
      application_rate: '15 kg/acre',
      application_timing: '30 days after sowing',
      cost_per_acre: '₹450',
      nutrient_content: { N: '46%', P: '0%', K: '0%' },
      benefits: ['High nitrogen content', 'Cost-effective', 'Quick plant response'],
      application_method: 'Side dressing near plant roots'
    },
    {
      fertilizer_name: 'DAP (Diammonium Phosphate)',
      application_rate: '20 kg/acre',
      application_timing: 'At planting time',
      cost_per_acre: '₹800',
      nutrient_content: { N: '18%', P: '46%', K: '0%' },
      benefits: ['High phosphorus for root development', 'Starter fertilizer', 'Good for flowering'],
      application_method: 'Placement near seed furrow'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Smart Fertilizer Recommendation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get personalized fertilizer recommendations based on your soil analysis, crop type, and farming conditions
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  ${currentStep >= step ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-gray-600">
            Step {currentStep} of 4: {
              ['Crop Information', 'Soil Analysis', 'Farm Details', 'Recommendations'][currentStep - 1]
            }
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Crop Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Crop Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
                  <select
                    value={formData.cropInfo.crop_type}
                    onChange={(e) => handleInputChange('cropInfo', 'crop_type', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Select Crop</option>
                    {cropOptions.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crop Variety</label>
                  <input
                    type="text"
                    value={formData.cropInfo.crop_variety}
                    onChange={(e) => handleInputChange('cropInfo', 'crop_variety', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., Basmati, IR64, Hybrid"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Growth Stage</label>
                  <select
                    value={formData.cropInfo.growth_stage}
                    onChange={(e) => handleInputChange('cropInfo', 'growth_stage', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Select Growth Stage</option>
                    {growthStages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cultivation Area (acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.cropInfo.cultivation_area}
                    onChange={(e) => handleInputChange('cropInfo', 'cultivation_area', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., 2.5"
                  />
                </div>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">💡 Pro Tip</h3>
                <p className="text-sm text-yellow-700">
                  Different crops have varying nutrient requirements at different growth stages. Accurate information helps us provide precise fertilizer recommendations.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Soil Analysis */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Soil Analysis Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Nitrogen (N) <span className="text-gray-500">(kg/ha)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.soilData.nitrogen}
                    onChange={(e) => handleInputChange('soilData', 'nitrogen', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., 45"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Low: &lt;240, Medium: 240-480, High: &gt;480
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Phosphorus (P) <span className="text-gray-500">(kg/ha)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.soilData.phosphorus}
                    onChange={(e) => handleInputChange('soilData', 'phosphorus', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., 25"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Low: &lt;11, Medium: 11-22, High: &gt;22
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Potassium (K) <span className="text-gray-500">(kg/ha)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.soilData.potassium}
                    onChange={(e) => handleInputChange('soilData', 'potassium', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., 180"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Low: &lt;120, Medium: 120-280, High: &gt;280
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soil pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.soilData.ph}
                    onChange={(e) => handleInputChange('soilData', 'ph', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., 6.5"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Acidic: &lt;6.0, Neutral: 6.0-7.5, Alkaline: &gt;7.5
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organic Matter <span className="text-gray-500">(%)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.soilData.organic_matter}
                    onChange={(e) => handleInputChange('soilData', 'organic_matter', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., 2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                  <select
                    value={formData.soilData.soil_type}
                    onChange={(e) => handleInputChange('soilData', 'soil_type', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Select Soil Type</option>
                    {soilTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">🔬 Soil Testing Tip</h3>
                <p className="text-sm text-green-700">
                  For accurate results, get your soil tested at a certified laboratory. Many agricultural extension offices provide affordable soil testing services.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Farm Details */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Farm & Application Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation Type</label>
                  <select
                    value={formData.farmDetails.irrigation_type}
                    onChange={(e) => handleInputChange('farmDetails', 'irrigation_type', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Select Irrigation</option>
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler Irrigation</option>
                    <option value="Flood">Flood Irrigation</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Previous Fertilizer Used</label>
                  <input
                    type="text"
                    value={formData.farmDetails.previous_fertilizer}
                    onChange={(e) => handleInputChange('farmDetails', 'previous_fertilizer', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., Urea, NPK 10:26:26"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget per Acre <span className="text-gray-500">(₹)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.farmDetails.budget_per_acre}
                    onChange={(e) => handleInputChange('farmDetails', 'budget_per_acre', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., 3000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Application Method</label>
                  <select
                    value={formData.farmDetails.application_method}
                    onChange={(e) => handleInputChange('farmDetails', 'application_method', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Select Method</option>
                    <option value="Broadcasting">Broadcasting</option>
                    <option value="Band placement">Band Placement</option>
                    <option value="Fertigation">Fertigation</option>
                    <option value="Foliar spray">Foliar Spray</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Recommendations */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Fertilizer Recommendations</h2>
              {recommendations.length > 0 ? (
                <div className="space-y-6">
                  {recommendations.map((fertilizer, index) => (
                    <div key={index} className="bg-gradient-to-r from-yellow-50 to-green-50 p-6 rounded-xl border border-yellow-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{fertilizer.fertilizer_name}</h3>
                          <p className="text-yellow-600 font-semibold">Application Rate: {fertilizer.application_rate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">Cost per Acre</p>
                          <p className="text-lg font-bold text-green-600">{fertilizer.cost_per_acre}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-700 mb-2">Nutrient Content</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Nitrogen (N):</span>
                              <span className="font-semibold">{fertilizer.nutrient_content.N}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Phosphorus (P):</span>
                              <span className="font-semibold">{fertilizer.nutrient_content.P}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Potassium (K):</span>
                              <span className="font-semibold">{fertilizer.nutrient_content.K}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-700 mb-2">Application Details</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Timing:</strong> {fertilizer.application_timing}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Method:</strong> {fertilizer.application_method}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-700 mb-2">Key Benefits</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {fertilizer.benefits.slice(0, 3).map((benefit, idx) => (
                              <li key={idx} className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Application Instructions</h4>
                        <p className="text-sm text-blue-700">
                          Apply {fertilizer.application_rate} {fertilizer.application_timing.toLowerCase()}. 
                          Use {fertilizer.application_method.toLowerCase()} for best results. 
                          Ensure adequate soil moisture during application.
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Total Cost Summary */}
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl border border-green-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Cost Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg text-center">
                        <p className="text-gray-600">Total Fertilizer Cost</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{recommendations.reduce((sum, f) => sum + parseInt(f.cost_per_acre.replace(/[₹,]/g, '')), 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">Per acre</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg text-center">
                        <p className="text-gray-600">Total Area Cost</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{(recommendations.reduce((sum, f) => sum + parseInt(f.cost_per_acre.replace(/[₹,]/g, '')), 0) * 
                            parseFloat(formData.cropInfo.cultivation_area || 1)).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">For {formData.cropInfo.cultivation_area || 1} acres</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg text-center">
                        <p className="text-gray-600">Expected Yield Increase</p>
                        <p className="text-2xl font-bold text-yellow-600">15-25%</p>
                        <p className="text-sm text-gray-500">With proper application</p>
                      </div>
                    </div>
                  </div>
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
            {currentStep > 1 && currentStep < 4 && (
              <button
                onClick={handlePrevStep}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Previous
              </button>
            )}
            
            {currentStep < 3 && (
              <button
                onClick={handleNextStep}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition duration-300 ml-auto"
              >
                Next
              </button>
            )}
            
            {currentStep === 3 && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition duration-300 ml-auto disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Get Recommendations'}
              </button>
            )}
            
            {currentStep === 4 && (
              <div className="flex space-x-4 ml-auto">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setRecommendations([]);
                    setFormData({
                      cropInfo: { crop_type: '', crop_variety: '', growth_stage: '', cultivation_area: '' },
                      soilData: { nitrogen: '', phosphorus: '', potassium: '', ph: '', organic_matter: '', soil_type: '' },
                      farmDetails: { irrigation_type: '', previous_fertilizer: '', budget_per_acre: '', application_method: '' }
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
                  Download Report
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Educational Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Balanced Nutrition</h3>
            <p className="text-gray-600 text-sm">
              Proper NPK balance ensures healthy plant growth, better yields, and improved crop quality.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Cost Effective</h3>
            <p className="text-gray-600 text-sm">
              Targeted fertilizer application reduces waste and maximizes return on investment.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Sustainable Farming</h3>
            <p className="text-gray-600 text-sm">
              Scientific fertilizer recommendations promote environmental sustainability and soil health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
