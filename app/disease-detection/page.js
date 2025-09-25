'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [error, setError] = useState('');
  
  // Flask API configuration
  const API_BASE_URL = 'http://localhost:5001'; // Your Flask API URL

  // Handle file selection
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size too large! Please choose an image smaller than 10MB.');
        return;
      }

      setSelectedImage(file);
      setError('');
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Reset previous results
      setResults(null);
    } else {
      setError('Please select a valid image file (JPG, PNG, etc.)');
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Main analysis function - integrated with your Flask API
  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    
    try {
      // Create form data for your Flask API
      const formData = new FormData();
      formData.append('image', selectedImage);

      console.log('Sending request to Flask API...');
      
      // Call your Flask API
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const apiResult = await response.json();
      
      if (!apiResult.success) {
        throw new Error(apiResult.error || 'Prediction failed');
      }

      console.log('API Response:', apiResult);

      // Transform your Flask API response to match the UI format
      const transformedResult = transformFlaskResponse(apiResult);
      setResults(transformedResult);
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        image: imagePreview,
        result: transformedResult,
        timestamp: new Date().toLocaleString()
      };
      setAnalysisHistory(prev => [historyItem, ...prev.slice(0, 4)]); // Keep last 5

    } catch (error) {
      console.error('Disease detection error:', error);
      setError(`Analysis failed: ${error.message}`);
      
      // You can optionally show a fallback message or mock result
      // const mockResult = generateMockResults();
      // setResults(mockResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Transform Flask API response to your UI format
  const transformFlaskResponse = (apiResult) => {
    const { prediction, top_predictions, image_info } = apiResult;
    
    // Parse disease information from your model's format
    const disease_parts = prediction.disease.split('___');
    const plant_type = disease_parts[0]?.replace('_', ' ').replace(/([A-Z])/g, ' $1').trim() || 'Unknown';
    const disease_name = disease_parts[1]?.replace('_', ' ').replace(/([A-Z])/g, ' $1').trim() || prediction.disease;
    
    // Create detailed disease information
    const diseaseInfo = createDiseaseInfo(plant_type, disease_name, prediction.is_healthy);
    
    return {
      detected_diseases: [
        {
          disease_name: prediction.is_healthy ? `${plant_type} - Healthy` : disease_name,
          confidence: Math.round(prediction.confidence * 100),
          severity: prediction.is_healthy ? "None" : getSeverityLevel(prediction.confidence),
          crop_affected: plant_type,
          description: diseaseInfo.description,
          symptoms: diseaseInfo.symptoms,
          treatment: diseaseInfo.treatment,
          prevention: diseaseInfo.prevention,
          recommended_products: diseaseInfo.products
        }
      ],
      analysis_summary: {
        total_diseases_found: prediction.is_healthy ? 0 : 1,
        primary_disease: prediction.is_healthy ? "No Disease Detected" : disease_name,
        overall_severity: prediction.is_healthy ? "Healthy" : getSeverityLevel(prediction.confidence),
        confidence_average: Math.round(prediction.confidence * 100)
      },
      image_quality: "Good",
      processing_time: "Real-time",
      top_predictions: top_predictions || [],
      original_prediction: prediction // Keep original for reference
    };
  };

  // Determine severity based on confidence
  const getSeverityLevel = (confidence) => {
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.6) return "Medium";
    return "Low";
  };

  // Create detailed disease information based on plant type and disease
  const createDiseaseInfo = (plant_type, disease_name, is_healthy) => {
    if (is_healthy) {
      return {
        description: `Your ${plant_type.toLowerCase()} plant appears to be healthy! Continue with good care practices to maintain plant health.`,
        symptoms: [
          "Green, vibrant foliage",
          "No visible spots or discoloration",
          "Normal growth patterns",
          "Healthy leaf structure"
        ],
        treatment: [
          "Continue current care routine",
          "Monitor regularly for changes",
          "Maintain optimal growing conditions"
        ],
        prevention: [
          "Provide adequate sunlight and water",
          "Ensure good air circulation",
          "Regular inspection for early detection",
          "Maintain soil health"
        ],
        products: [
          { name: "Organic Fertilizer", dosage: "As per package instructions", price: "₹150/kg" },
          { name: "Neem Oil (Preventive)", dosage: "2ml/L water", price: "₹120/100ml" }
        ]
      };
    }

    // Disease-specific information (you can expand this based on your model's classes)
    const diseaseDatabase = {
      "Apple Scab": {
        description: "Apple scab is a fungal disease caused by Venturia inaequalis that affects apple trees, causing dark spots on leaves and fruit.",
        symptoms: ["Dark, scabby spots on leaves", "Premature leaf drop", "Fruit lesions", "Reduced fruit quality"],
        treatment: ["Apply fungicide sprays", "Remove infected leaves", "Improve air circulation", "Prune affected branches"],
        prevention: ["Choose resistant varieties", "Proper spacing", "Fall cleanup", "Preventive spraying"],
        products: [
          { name: "Copper Fungicide", dosage: "2g/L", price: "₹180/250g" },
          { name: "Myclobutanil", dosage: "1ml/L", price: "₹220/100ml" }
        ]
      },
      "Early Blight": {
        description: "Early blight is caused by Alternaria species and affects tomatoes and potatoes, causing dark spots with concentric rings.",
        symptoms: ["Dark spots with target-like rings", "Yellow halos around spots", "Leaf yellowing and drop", "Stem lesions"],
        treatment: ["Apply fungicide", "Remove infected plant parts", "Improve air circulation", "Avoid overhead watering"],
        prevention: ["Crop rotation", "Proper spacing", "Mulching", "Resistant varieties"],
        products: [
          { name: "Mancozeb 75% WP", dosage: "2.5g/L", price: "₹180/500g" },
          { name: "Chlorothalonil", dosage: "2ml/L", price: "₹240/250ml" }
        ]
      },
      "Late Blight": {
        description: "Late blight is a destructive disease caused by Phytophthora infestans affecting tomatoes and potatoes.",
        symptoms: ["Water-soaked lesions", "White fungal growth", "Rapid leaf death", "Brown stem lesions"],
        treatment: ["Copper-based fungicides", "Remove infected parts", "Improve drainage", "Reduce humidity"],
        prevention: ["Use resistant varieties", "Proper ventilation", "Avoid overhead irrigation", "Weather monitoring"],
        products: [
          { name: "Copper Oxychloride", dosage: "3g/L", price: "₹160/500g" },
          { name: "Metalaxyl + Mancozeb", dosage: "2g/L", price: "₹280/250g" }
        ]
      }
      // Add more diseases as needed
    };

    // Return disease info or default if not found
    return diseaseDatabase[disease_name] || {
      description: `${disease_name} detected in ${plant_type.toLowerCase()}. Consult with agricultural experts for specific treatment recommendations.`,
      symptoms: ["Visible disease symptoms on plant", "Abnormal leaf patterns", "Potential growth issues"],
      treatment: ["Consult agricultural expert", "Apply appropriate treatment", "Monitor plant condition"],
      prevention: ["Regular inspection", "Maintain plant health", "Follow good agricultural practices"],
      products: [
        { name: "General Fungicide", dosage: "As recommended", price: "₹200/250g" },
        { name: "Plant Health Booster", dosage: "As per label", price: "₹150/500ml" }
      ]
    };
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResults(null);
    setError('');
  };

  // Check API health function
  const checkAPIHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      console.log('API Health:', data);
      return data.model_loaded;
    } catch (error) {
      console.error('API Health Check Failed:', error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Plant Disease Detection</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload a photo of your plant's diseased leaves to get instant AI-powered disease identification and treatment recommendations
          </p>
          
          {/* API Status Indicator */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={checkAPIHealth}
              className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition"
            >
              🔄 Check API Status
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Rest of your existing UI remains the same */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Plant Image</h2>
              
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${
                  dragActive 
                    ? 'border-red-400 bg-red-50' 
                    : selectedImage 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 hover:border-red-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative w-full max-w-md mx-auto">
                      <img
                        src={imagePreview}
                        alt="Selected plant"
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                      >
                        Change Image
                      </button>
                      <button
                        onClick={resetAnalysis}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drag and drop your plant image here
                      </p>
                      <p className="text-gray-500 mb-4">
                        or click to select from your device
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300"
                      >
                        Choose Image
                      </button>
                    </div>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </div>

              {/* Image Guidelines */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">📸 For Best Results:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use clear, well-lit photos of diseased leaves</li>
                  <li>• Ensure the entire leaf is visible in the frame</li>
                  <li>• Avoid blurry or dark images</li>
                  <li>• Include symptoms like spots, discoloration, or wilting</li>
                  <li>• Supported formats: JPG, PNG, WEBP (max 10MB)</li>
                </ul>
              </div>

              {/* Analyze Button */}
              {selectedImage && (
                <div className="mt-6">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Analyzing with AI Model...</span>
                      </div>
                    ) : (
                      'Detect Disease with AI'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Analysis History Sidebar - Keep your existing code */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Analyses</h3>
              {analysisHistory.length > 0 ? (
                <div className="space-y-4">
                  {analysisHistory.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                      <img
                        src={item.image}
                        alt="Analyzed plant"
                        className="w-full h-20 object-cover rounded mb-2"
                      />
                      <p className="text-sm font-medium text-gray-800">
                        {item.result.detected_diseases?.[0]?.disease_name}
                      </p>
                      <p className="text-xs text-gray-500">{item.timestamp}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">No analyses yet</p>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Quick Tips</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Take photos during daylight for better accuracy</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Focus on the most affected parts of the plant</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Clean the camera lens before taking photos</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Include both healthy and diseased areas if possible</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section - Keep all your existing results display code */}
        {results && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">AI Disease Analysis Results</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Confidence:</span>
                <span className="text-lg font-bold text-red-600">
                  {results.analysis_summary.confidence_average}%
                </span>
              </div>
            </div>

            {/* Show top predictions from your model */}
            {results.top_predictions && results.top_predictions.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">🎯 Top Predictions from AI Model:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {results.top_predictions.slice(0, 3).map((pred, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border">
                      <p className="font-medium text-gray-800 text-sm">{pred.disease.replace('___', ' - ').replace(/_/g, ' ')}</p>
                      <p className="text-xs text-blue-600 font-medium">{pred.confidence_percent}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rest of your existing results display code... */}
            {/* Analysis Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Diseases Found</p>
                <p className="text-2xl font-bold text-red-600">{results.analysis_summary.total_diseases_found}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Primary Disease</p>
                <p className="text-lg font-bold text-orange-600">{results.analysis_summary.primary_disease}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Severity Level</p>
                <p className="text-lg font-bold text-yellow-600">{results.analysis_summary.overall_severity}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Processing Time</p>
                <p className="text-lg font-bold text-blue-600">{results.processing_time}</p>
              </div>
            </div>

            {/* Keep all your existing disease details display code... */}
            {results.detected_diseases.map((disease, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{disease.disease_name}</h3>
                    <p className="text-gray-600">Affecting: {disease.crop_affected}</p>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      disease.severity === 'High' ? 'bg-red-100 text-red-800' :
                      disease.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      disease.severity === 'None' ? 'bg-green-100 text-green-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {disease.severity === 'None' ? 'Healthy' : `${disease.severity} Severity`}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{disease.confidence}% confidence</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{disease.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Symptoms */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {disease.severity === 'None' ? 'Healthy Signs' : 'Symptoms'}
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {disease.symptoms.map((symptom, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className={`${disease.severity === 'None' ? 'text-green-400' : 'text-red-400'} mr-2`}>•</span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Treatment */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {disease.severity === 'None' ? 'Care Tips' : 'Treatment'}
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {disease.treatment.map((treatment, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          {treatment}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prevention */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Prevention
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {disease.prevention.map((prevention, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-400 mr-2">•</span>
                          {prevention}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended Products */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">🛒 Recommended Products</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {disease.recommended_products.map((product, idx) => (
                      <div key={idx} className="bg-white p-3 rounded border">
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-600">Dosage: {product.dosage}</p>
                        <p className="text-sm text-green-600 font-medium">{product.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={resetAnalysis}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Analyze Another Image
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Download Report
              </button>
              <button
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Share Results
              </button>
            </div>
          </div>
        )}

        {/* Keep your existing Educational Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered Detection</h3>
            <p className="text-gray-600 text-sm">
              Our advanced machine learning models can identify 38+ plant diseases with high accuracy using your trained TensorFlow model.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💚</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Expert Recommendations</h3>
            <p className="text-gray-600 text-sm">
              Get treatment suggestions from agricultural experts and access to recommended products for effective disease management.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
            <p className="text-gray-600 text-sm">
              Upload your plant image and receive detailed disease analysis with treatment plans within seconds, available 24/7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
