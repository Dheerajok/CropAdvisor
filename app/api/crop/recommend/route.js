// app/api/crop/recommend/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/db/mongodb'; // ✅ Correct path
import CropRecommendation from '@/app/model/CropRecommendation'; // ✅ Correct path - NOT from page.js!

export async function POST(request) {
  try {
    await connectDB();
    console.log('MongoDB Connected successfully');

    const body = await request.json();
    const { 
      userId, 
      location, 
      soilData, 
      climateData, 
      marketData 
    } = body;

    // Validate required data
    if (!soilData || !climateData || !marketData) {
      return NextResponse.json(
        { message: 'Missing required data: soil, climate, or market information' },
        { status: 400 }
      );
    }

    // Prepare data for ML model
    const inputFeatures = [
      soilData.nitrogen,
      soilData.phosphorus, 
      soilData.potassium,
      soilData.ph,
      climateData.temperature,
      climateData.humidity,
      climateData.rainfall
    ];

    // Get crop recommendations using ML algorithm
    const recommendations = await predictCrops(inputFeatures, marketData);

    // Save recommendation to database
    const cropRecommendation = new CropRecommendation({
      userId: userId || 'anonymous',
      location,
      soilData,
      climateData,
      marketData,
      recommendations
    });

    await cropRecommendation.save();
    console.log('Recommendation saved to database');

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        recommendation_id: cropRecommendation._id,
        analysis_summary: {
          soil_quality: analyzeSoilForCrops(soilData),
          climate_suitability: analyzeClimate(climateData),
          market_factors: analyzeMarketFactors(marketData)
        }
      }
    });
  } catch (error) {
    console.error('Crop Recommendation Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to generate crop recommendations',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// Machine Learning prediction function
async function predictCrops(features, marketData) {
  const [nitrogen, phosphorus, potassium, ph, temperature, humidity, rainfall] = features;
  
  // Crop database with growing requirements
  const cropDatabase = [
    {
      name: 'Rice',
      requirements: { 
        temp_min: 20, temp_max: 35, 
        humid_min: 70, rain_min: 1000,
        ph_min: 5.5, ph_max: 7.0,
        n_min: 30, p_min: 15, k_min: 100
      },
      yield_per_acre: 2.5,
      market_price: 1800,
      season: ['Kharif']
    },
    {
      name: 'Wheat',
      requirements: { 
        temp_min: 10, temp_max: 25, 
        humid_min: 50, rain_min: 400,
        ph_min: 6.0, ph_max: 7.5,
        n_min: 40, p_min: 20, k_min: 150
      },
      yield_per_acre: 2.0,
      market_price: 2000,
      season: ['Rabi']
    },
    {
      name: 'Maize',
      requirements: { 
        temp_min: 21, temp_max: 30, 
        humid_min: 60, rain_min: 600,
        ph_min: 6.0, ph_max: 7.0,
        n_min: 50, p_min: 25, k_min: 200
      },
      yield_per_acre: 3.0,
      market_price: 1600,
      season: ['Kharif', 'Rabi']
    },
    {
      name: 'Cotton',
      requirements: { 
        temp_min: 25, temp_max: 35, 
        humid_min: 50, rain_min: 700,
        ph_min: 6.5, ph_max: 8.0,
        n_min: 60, p_min: 30, k_min: 300
      },
      yield_per_acre: 1.5,
      market_price: 5000,
      season: ['Kharif']
    },
    {
      name: 'Sugarcane',
      requirements: { 
        temp_min: 26, temp_max: 32, 
        humid_min: 80, rain_min: 1200,
        ph_min: 6.0, ph_max: 7.5,
        n_min: 80, p_min: 40, k_min: 400
      },
      yield_per_acre: 40,
      market_price: 350,
      season: ['Kharif']
    },
    {
      name: 'Tomato',
      requirements: { 
        temp_min: 18, temp_max: 27, 
        humid_min: 60, rain_min: 500,
        ph_min: 6.0, ph_max: 7.0,
        n_min: 35, p_min: 18, k_min: 120
      },
      yield_per_acre: 8.0,
      market_price: 1500,
      season: ['Rabi', 'Zaid']
    }
  ];

  // Filter crops by season
  const seasonalCrops = cropDatabase.filter(crop => 
    crop.season.includes(marketData.season)
  );

  // Calculate suitability scores
  const recommendations = seasonalCrops.map(crop => {
    const suitabilityScore = calculateSuitabilityScore(
      crop.requirements, 
      { nitrogen, phosphorus, potassium, ph, temperature, humidity, rainfall }
    );

    const profitability = calculateProfitability(crop, marketData.farm_size);

    return {
      crop_name: crop.name,
      confidence_score: Math.round(suitabilityScore),
      expected_yield: crop.yield_per_acre * marketData.farm_size,
      profit_margin: profitability,
      growing_tips: getGrowingTips(crop.name),
      market_price: crop.market_price,
      season_suitability: crop.season
    };
  }).sort((a, b) => b.confidence_score - a.confidence_score);

  return recommendations.slice(0, 5); // Top 5 recommendations
}

function calculateSuitabilityScore(requirements, conditions) {
  let score = 0;

  // Temperature suitability
  if (conditions.temperature >= requirements.temp_min && 
      conditions.temperature <= requirements.temp_max) {
    score += 20;
  } else {
    const temp_deviation = Math.min(
      Math.abs(conditions.temperature - requirements.temp_min),
      Math.abs(conditions.temperature - requirements.temp_max)
    );
    score += Math.max(0, 20 - temp_deviation);
  }

  // Humidity suitability
  if (conditions.humidity >= requirements.humid_min) {
    score += 15;
  } else {
    score += (conditions.humidity / requirements.humid_min) * 15;
  }

  // Rainfall suitability
  if (conditions.rainfall >= requirements.rain_min) {
    score += 15;
  } else {
    score += (conditions.rainfall / requirements.rain_min) * 15;
  }

  // pH suitability
  if (conditions.ph >= requirements.ph_min && conditions.ph <= requirements.ph_max) {
    score += 20;
  } else {
    const ph_deviation = Math.min(
      Math.abs(conditions.ph - requirements.ph_min),
      Math.abs(conditions.ph - requirements.ph_max)
    );
    score += Math.max(0, 20 - ph_deviation * 5);
  }

  // Nutrient suitability
  const nutrient_score = (
    Math.min(conditions.nitrogen / requirements.n_min, 1) * 10 +
    Math.min(conditions.phosphorus / requirements.p_min, 1) * 10 +
    Math.min(conditions.potassium / requirements.k_min, 1) * 10
  );
  score += nutrient_score;

  return Math.min(100, score);
}

function calculateProfitability(crop, farmSize) {
  const revenue = crop.yield_per_acre * crop.market_price * farmSize;
  const estimatedCost = revenue * 0.6; // Assume 60% cost ratio
  return revenue - estimatedCost;
}

function getGrowingTips(cropName) {
  const tips = {
    'Rice': [
      'Maintain water level of 2-3 cm in early stages',
      'Apply nitrogen fertilizer in 3 splits',
      'Monitor for blast and brown spot diseases'
    ],
    'Wheat': [
      'Sow seeds at 2-3 cm depth',
      'Irrigate at crown root initiation stage',
      'Apply fungicides to prevent rust diseases'
    ],
    'Maize': [
      'Plant seeds 3-4 cm deep with 60cm row spacing',
      'Side-dress with nitrogen at knee-high stage',
      'Control weeds in first 6 weeks'
    ],
    'Cotton': [
      'Maintain plant population of 50,000-60,000 per hectare',
      'Apply potash before flowering',
      'Regular monitoring for bollworm'
    ],
    'Sugarcane': [
      'Plant healthy seed canes in furrows',
      'Earthing up at 90-120 days after planting',
      'Adequate irrigation throughout growing period'
    ],
    'Tomato': [
      'Transplant seedlings after 4-5 weeks',
      'Provide support stakes for indeterminate varieties',
      'Regular pruning of suckers'
    ]
  };

  return tips[cropName] || ['Follow standard agricultural practices'];
}

// Additional analysis helper functions
function analyzeSoilForCrops(soilData) {
  return {
    fertility_rating: 'Good',
    limiting_factors: [],
    suitable_crop_types: []
  };
}

function analyzeClimate(climateData) {
  return {
    season_suitability: 'Suitable',
    irrigation_requirement: climateData.rainfall < 500 ? 'High' : 'Medium',
    climate_risks: []
  };
}

function analyzeMarketFactors(marketData) {
  return {
    optimal_farm_size: marketData.farm_size >= 2 ? 'Good' : 'Small',
    season: marketData.season,
    investment_capacity: marketData.budget ? 'Available' : 'Limited'
  };
}
