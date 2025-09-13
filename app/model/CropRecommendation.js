// app/models/CropRecommendation.js
import mongoose from 'mongoose';

const CropRecommendationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    city: { type: String },
    state: { type: String }
  },
  soilData: {
    nitrogen: { type: Number, required: true },
    phosphorus: { type: Number, required: true },
    potassium: { type: Number, required: true },
    ph: { type: Number, required: true },
    organic_matter: { type: Number },
    moisture: { type: Number }
  },
  climateData: {
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    rainfall: { type: Number, required: true },
    sunlight_hours: { type: Number }
  },
  marketData: {
    season: { type: String, enum: ['Kharif', 'Rabi', 'Zaid'], required: true },
    farm_size: { type: Number, required: true },
    budget: { type: Number }
  },
  recommendations: [{
    crop_name: { type: String, required: true },
    confidence_score: { type: Number, required: true },
    expected_yield: { type: Number },
    profit_margin: { type: Number },
    growing_tips: [String],
    market_price: { type: Number },
    season_suitability: [String]
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.CropRecommendation || 
  mongoose.model('CropRecommendation', CropRecommendationSchema);
