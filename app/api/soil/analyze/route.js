// app/api/soil/analyze/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nitrogen, phosphorus, potassium, ph, organic_matter, moisture, location } = body;

    // Validate input data
    if (!nitrogen || !phosphorus || !potassium || !ph) {
      return NextResponse.json(
        { message: 'Required soil parameters missing: N, P, K, pH' },
        { status: 400 }
      );
    }

    // Soil quality analysis algorithm
    const soilAnalysis = analyzeSoilQuality({
      nitrogen, phosphorus, potassium, ph, organic_matter, moisture
    });

    // Get soil recommendations based on analysis
    const recommendations = getSoilRecommendations(soilAnalysis);

    return NextResponse.json({
      success: true,
      data: {
        soil_analysis: soilAnalysis,
        recommendations: recommendations,
        input_values: { nitrogen, phosphorus, potassium, ph, organic_matter, moisture }
      }
    });
  } catch (error) {
    console.error('Soil Analysis Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to analyze soil data',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// Soil analysis helper functions (same as before)
function analyzeSoilQuality({ nitrogen, phosphorus, potassium, ph, organic_matter, moisture }) {
  const analysis = {
    nutrient_status: {},
    ph_status: '',
    moisture_status: '',
    overall_quality: '',
    fertility_score: 0
  };

  // Analyze individual nutrients
  analysis.nutrient_status.nitrogen = classifyNutrientLevel(nitrogen, { low: 0, medium: 40, high: 80 });
  analysis.nutrient_status.phosphorus = classifyNutrientLevel(phosphorus, { low: 0, medium: 20, high: 50 });
  analysis.nutrient_status.potassium = classifyNutrientLevel(potassium, { low: 0, medium: 200, high: 400 });

  // Analyze pH level
  if (ph < 6.0) analysis.ph_status = 'Acidic';
  else if (ph > 7.5) analysis.ph_status = 'Alkaline';
  else analysis.ph_status = 'Neutral';

  // Calculate fertility score (0-100)
  let score = 0;
  score += nitrogen > 40 ? 25 : (nitrogen / 40) * 25;
  score += phosphorus > 20 ? 25 : (phosphorus / 20) * 25;
  score += potassium > 200 ? 25 : (potassium / 200) * 25;
  score += (ph >= 6.0 && ph <= 7.5) ? 25 : Math.max(0, 25 - Math.abs(ph - 6.75) * 10);

  analysis.fertility_score = Math.round(score);
  
  if (score >= 80) analysis.overall_quality = 'Excellent';
  else if (score >= 60) analysis.overall_quality = 'Good';
  else if (score >= 40) analysis.overall_quality = 'Fair';
  else analysis.overall_quality = 'Poor';

  return analysis;
}

function classifyNutrientLevel(value, thresholds) {
  if (value >= thresholds.high) return 'High';
  else if (value >= thresholds.medium) return 'Medium';
  else return 'Low';
}

function getSoilRecommendations(analysis) {
  const recommendations = [];
  
  // Nutrient-specific recommendations
  if (analysis.nutrient_status.nitrogen === 'Low') {
    recommendations.push('Apply nitrogen-rich fertilizers like urea or ammonium sulfate');
  }
  if (analysis.nutrient_status.phosphorus === 'Low') {
    recommendations.push('Add phosphorus fertilizer or bone meal to improve P levels');
  }
  if (analysis.nutrient_status.potassium === 'Low') {
    recommendations.push('Use potassium sulfate or wood ash to boost K levels');
  }

  // pH recommendations
  if (analysis.ph_status === 'Acidic') {
    recommendations.push('Add lime to raise soil pH and reduce acidity');
  } else if (analysis.ph_status === 'Alkaline') {
    recommendations.push('Add sulfur or organic matter to lower soil pH');
  }

  return recommendations;
}
