// app/api/fertilizer/recommend/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// MongoDB connection (inline to avoid import issues)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crop-advisory';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      console.log('MongoDB Connected:', mongoose.connection.host);
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

// Fertilizer Recommendation Schema (inline)
const FertilizerRecommendationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cropInfo: {
    crop_type: { type: String, required: true },
    crop_variety: { type: String },
    growth_stage: { type: String, required: true },
    cultivation_area: { type: Number, required: true }
  },
  soilData: {
    nitrogen: { type: Number, required: true },
    phosphorus: { type: Number, required: true },
    potassium: { type: Number, required: true },
    ph: { type: Number, required: true },
    organic_matter: { type: Number },
    soil_type: { type: String }
  },
  farmDetails: {
    irrigation_type: { type: String },
    previous_fertilizer: { type: String },
    budget_per_acre: { type: Number },
    application_method: { type: String }
  },
  recommendations: [{
    fertilizer_name: { type: String, required: true },
    application_rate: { type: String, required: true },
    application_timing: { type: String, required: true },
    cost_per_acre: { type: String, required: true },
    nutrient_content: {
      N: { type: String },
      P: { type: String },
      K: { type: String }
    },
    benefits: [String],
    application_method: { type: String }
  }],
  totalCost: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

const FertilizerRecommendation = mongoose.models.FertilizerRecommendation || 
  mongoose.model('FertilizerRecommendation', FertilizerRecommendationSchema);

export async function POST(request) {
  try {
    await dbConnect();
    console.log('Fertilizer API: MongoDB Connected');

    const body = await request.json();
    const { userId, cropInfo, soilData, farmDetails } = body;

    // Validate required data
    if (!cropInfo || !soilData || !farmDetails) {
      return NextResponse.json(
        { message: 'Missing required data: cropInfo, soilData, or farmDetails' },
        { status: 400 }
      );
    }

    console.log('Processing fertilizer recommendation for:', cropInfo.crop_type);

    // Generate fertilizer recommendations
    const recommendations = generateFertilizerRecommendations(cropInfo, soilData, farmDetails);

    // Calculate total cost
    const totalCost = calculateTotalCost(recommendations, cropInfo.cultivation_area);

    // Save to database
    const fertilizerRecommendation = new FertilizerRecommendation({
      userId: userId || 'anonymous',
      cropInfo,
      soilData,
      farmDetails,
      recommendations,
      totalCost
    });

    await fertilizerRecommendation.save();
    console.log('Fertilizer recommendation saved successfully');

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        recommendation_id: fertilizerRecommendation._id,
        total_cost: totalCost,
        expected_yield_increase: '15-25%',
        analysis_summary: {
          soil_status: analyzeSoilStatus(soilData),
          nutrient_requirements: calculateNutrientRequirements(cropInfo, soilData),
          cost_per_acre: Math.round(totalCost / cropInfo.cultivation_area)
        }
      }
    });

  } catch (error) {
    console.error('Fertilizer API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to generate fertilizer recommendations',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// Fertilizer recommendation algorithm
function generateFertilizerRecommendations(cropInfo, soilData, farmDetails) {
  const { crop_type, growth_stage, cultivation_area } = cropInfo;
  const { nitrogen, phosphorus, potassium, ph, soil_type } = soilData;

  // Crop nutrient requirements database [4][7]
  const cropRequirements = {
    'Rice': { N: 120, P: 60, K: 40, baseYield: 2500 },
    'Wheat': { N: 120, P: 60, K: 40, baseYield: 2000 },
    'Maize': { N: 150, P: 75, K: 60, baseYield: 3000 },
    'Cotton': { N: 160, P: 80, K: 80, baseYield: 1500 },
    'Sugarcane': { N: 200, P: 100, K: 120, baseYield: 40000 },
    'Tomato': { N: 180, P: 100, K: 150, baseYield: 8000 },
    'Potato': { N: 150, P: 75, K: 150, baseYield: 12000 },
    'Onion': { N: 100, P: 50, K: 50, baseYield: 15000 },
    'Soybean': { N: 30, P: 75, K: 45, baseYield: 1800 }, // N-fixing crop
    'Groundnut': { N: 25, P: 50, K: 75, baseYield: 2000 }
  };

  const cropReq = cropRequirements[crop_type] || cropRequirements['Rice'];

  // Calculate nutrient deficiency [8][13]
  const nDeficiency = Math.max(0, cropReq.N - nitrogen);
  const pDeficiency = Math.max(0, cropReq.P - phosphorus);
  const kDeficiency = Math.max(0, cropReq.K - potassium);

  // Growth stage multipliers
  const stageMultipliers = {
    'Seedling': { N: 0.3, P: 0.5, K: 0.3 },
    'Vegetative': { N: 0.5, P: 0.3, K: 0.4 },
    'Flowering': { N: 0.3, P: 0.4, K: 0.6 },
    'Fruiting': { N: 0.4, P: 0.3, K: 0.7 },
    'Maturity': { N: 0.2, P: 0.2, K: 0.3 }
  };

  const multiplier = stageMultipliers[growth_stage] || stageMultipliers['Vegetative'];

  // Calculate adjusted requirements
  const adjustedN = nDeficiency * multiplier.N;
  const adjustedP = pDeficiency * multiplier.P;
  const adjustedK = kDeficiency * multiplier.K;

  // Fertilizer database with composition and prices [5][10]
  const fertilizers = [
    { name: 'Urea', N: 46, P: 0, K: 0, price: 300, density: 1 },
    { name: 'DAP', N: 18, P: 46, K: 0, price: 400, density: 1 },
    { name: 'NPK 20:20:20', N: 20, P: 20, K: 20, price: 450, density: 1 },
    { name: 'NPK 10:26:26', N: 10, P: 26, K: 26, price: 420, density: 1 },
    { name: 'MOP (KCl)', N: 0, P: 0, K: 60, price: 280, density: 1 },
    { name: 'SSP', N: 0, P: 16, K: 0, price: 250, density: 1 },
    { name: 'Complex 12:32:16', N: 12, P: 32, K: 16, price: 480, density: 1 }
  ];

  const recommendations = [];

  // Primary fertilizer recommendation based on major deficiency
  if (adjustedN > 10) {
    if (adjustedP > 10) {
      // Need both N and P - recommend DAP
      const dapRate = calculateFertilizerRate(adjustedP, 46); // Based on P requirement
      const dapCost = calculateCost(dapRate, 400);
      
      recommendations.push({
        fertilizer_name: 'DAP (Diammonium Phosphate)',
        application_rate: `${dapRate} kg/acre`,
        application_timing: getApplicationTiming(growth_stage, 'DAP'),
        cost_per_acre: `₹${dapCost}`,
        nutrient_content: { N: '18%', P: '46%', K: '0%' },
        benefits: [
          'High phosphorus for root development',
          'Nitrogen for vegetative growth',
          'Ideal for flowering stage',
          'Quick nutrient release'
        ],
        application_method: getApplicationMethod('DAP', farmDetails.application_method)
      });
    } else {
      // Need mainly N - recommend Urea
      const ureaRate = calculateFertilizerRate(adjustedN, 46);
      const ureaCost = calculateCost(ureaRate, 300);
      
      recommendations.push({
        fertilizer_name: 'Urea',
        application_rate: `${ureaRate} kg/acre`,
        application_timing: getApplicationTiming(growth_stage, 'Urea'),
        cost_per_acre: `₹${ureaCost}`,
        nutrient_content: { N: '46%', P: '0%', K: '0%' },
        benefits: [
          'Highest nitrogen content',
          'Cost-effective nitrogen source',
          'Quick plant response',
          'Widely available'
        ],
        application_method: getApplicationMethod('Urea', farmDetails.application_method)
      });
    }
  }

  // Secondary fertilizer for balanced nutrition
  if (adjustedN > 5 && adjustedP > 5 && adjustedK > 5) {
    const npkRate = Math.max(
      calculateFertilizerRate(adjustedN, 20),
      calculateFertilizerRate(adjustedP, 20),
      calculateFertilizerRate(adjustedK, 20)
    );
    const npkCost = calculateCost(npkRate, 450);

    recommendations.push({
      fertilizer_name: 'NPK 20:20:20',
      application_rate: `${npkRate} kg/acre`,
      application_timing: getApplicationTiming(growth_stage, 'NPK'),
      cost_per_acre: `₹${npkCost}`,
      nutrient_content: { N: '20%', P: '20%', K: '20%' },
      benefits: [
        'Balanced nutrition',
        'Suitable for all growth stages',
        'Prevents nutrient deficiency',
        'Improves overall plant health'
      ],
      application_method: getApplicationMethod('NPK', farmDetails.application_method)
    });
  }

  // Potassium fertilizer if K deficiency is high
  if (adjustedK > 15) {
    const mopRate = calculateFertilizerRate(adjustedK, 60);
    const mopCost = calculateCost(mopRate, 280);

    recommendations.push({
      fertilizer_name: 'MOP (Muriate of Potash)',
      application_rate: `${mopRate} kg/acre`,
      application_timing: getApplicationTiming(growth_stage, 'MOP'),
      cost_per_acre: `₹${mopCost}`,
      nutrient_content: { N: '0%', P: '0%', K: '60%' },
      benefits: [
        'High potassium content',
        'Improves fruit quality',
        'Enhances disease resistance',
        'Better water regulation'
      ],
      application_method: getApplicationMethod('MOP', farmDetails.application_method)
    });
  }

  // Micronutrient recommendations based on pH [8]
  if (ph < 6.0) {
    recommendations.push({
      fertilizer_name: 'Zinc Sulfate + Lime',
      application_rate: '10 kg/acre ZnSO4 + 200 kg/acre Lime',
      application_timing: 'Before sowing',
      cost_per_acre: '₹350',
      nutrient_content: { N: '0%', P: '0%', K: '0%' },
      benefits: [
        'Corrects soil acidity',
        'Zinc deficiency correction',
        'Improves nutrient availability',
        'Better root development'
      ],
      application_method: 'Broadcasting and incorporation'
    });
  } else if (ph > 7.5) {
    recommendations.push({
      fertilizer_name: 'Iron Sulfate + Sulfur',
      application_rate: '15 kg/acre FeSO4 + 100 kg/acre Sulfur',
      application_timing: 'Before sowing',
      cost_per_acre: '₹400',
      nutrient_content: { N: '0%', P: '0%', K: '0%' },
      benefits: [
        'Reduces soil alkalinity',
        'Iron deficiency correction',
        'Improves chlorophyll synthesis',
        'Better nutrient uptake'
      ],
      application_method: 'Broadcasting and incorporation'
    });
  }

  return recommendations.slice(0, 4); // Top 4 recommendations
}

// Helper functions
function calculateFertilizerRate(nutrientNeeded, nutrientPercent) {
  // Formula: (Nutrient needed × 100) ÷ Nutrient percentage [13]
  return Math.round((nutrientNeeded * 100) / nutrientPercent);
}

function calculateCost(rate, pricePerKg) {
  return Math.round(rate * pricePerKg / 100); // Convert to rupees per acre
}

function getApplicationTiming(growthStage, fertilizerType) {
  const timings = {
    'Seedling': {
      'DAP': 'At planting time',
      'Urea': '15 days after sowing',
      'NPK': 'At planting time',
      'MOP': 'Before sowing'
    },
    'Vegetative': {
      'DAP': '20-25 days after sowing',
      'Urea': '30 days after sowing',
      'NPK': '25-30 days after sowing',
      'MOP': '20 days after sowing'
    },
    'Flowering': {
      'DAP': 'At flower initiation',
      'Urea': 'Split application during flowering',
      'NPK': 'At flower initiation',
      'MOP': 'At flower initiation'
    },
    'Fruiting': {
      'DAP': 'Not recommended at this stage',
      'Urea': 'Light application only',
      'NPK': 'At fruit setting',
      'MOP': 'At fruit development'
    }
  };

  return timings[growthStage]?.[fertilizerType] || 'As per crop requirement';
}

function getApplicationMethod(fertilizerType, preferredMethod) {
  const methods = {
    'DAP': 'Band placement near seed furrow',
    'Urea': 'Side dressing and incorporation',
    'NPK': 'Broadcasting and incorporation',
    'MOP': 'Broadcasting before planting'
  };

  return preferredMethod || methods[fertilizerType] || 'Broadcasting';
}

function calculateTotalCost(recommendations, cultivationArea) {
  const totalPerAcre = recommendations.reduce((sum, rec) => {
    const cost = parseInt(rec.cost_per_acre.replace(/[₹,]/g, ''));
    return sum + cost;
  }, 0);
  
  return totalPerAcre * cultivationArea;
}

function analyzeSoilStatus(soilData) {
  const { nitrogen, phosphorus, potassium, ph } = soilData;
  
  return {
    nitrogen_status: nitrogen < 240 ? 'Low' : nitrogen < 480 ? 'Medium' : 'High',
    phosphorus_status: phosphorus < 11 ? 'Low' : phosphorus < 22 ? 'Medium' : 'High',
    potassium_status: potassium < 120 ? 'Low' : potassium < 280 ? 'Medium' : 'High',
    ph_status: ph < 6.0 ? 'Acidic' : ph > 7.5 ? 'Alkaline' : 'Neutral',
    overall_fertility: calculateOverallFertility(nitrogen, phosphorus, potassium, ph)
  };
}

function calculateOverallFertility(n, p, k, ph) {
  let score = 0;
  
  // Nutrient scoring
  score += n >= 240 ? 25 : (n / 240) * 25;
  score += p >= 11 ? 25 : (p / 11) * 25;
  score += k >= 120 ? 25 : (k / 120) * 25;
  
  // pH scoring
  score += (ph >= 6.0 && ph <= 7.5) ? 25 : Math.max(0, 25 - Math.abs(ph - 6.75) * 5);
  
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

function calculateNutrientRequirements(cropInfo, soilData) {
  const { crop_type } = cropInfo;
  const { nitrogen, phosphorus, potassium } = soilData;
  
  const requirements = {
    'Rice': { N: 120, P: 60, K: 40 },
    'Wheat': { N: 120, P: 60, K: 40 },
    'Maize': { N: 150, P: 75, K: 60 },
    'Cotton': { N: 160, P: 80, K: 80 },
    'Tomato': { N: 180, P: 100, K: 150 }
  };
  
  const req = requirements[crop_type] || requirements['Rice'];
  
  return {
    nitrogen_needed: Math.max(0, req.N - nitrogen),
    phosphorus_needed: Math.max(0, req.P - phosphorus),
    potassium_needed: Math.max(0, req.K - potassium)
  };
}
