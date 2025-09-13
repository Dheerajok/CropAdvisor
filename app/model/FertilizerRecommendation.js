// app/models/FertilizerRecommendation.js
import mongoose from 'mongoose';

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
    fertilizer_type: { type: String }, // Primary, Secondary, Micronutrient
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
  expectedYieldIncrease: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.FertilizerRecommendation || 
  mongoose.model('FertilizerRecommendation', FertilizerRecommendationSchema);
