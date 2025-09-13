// app/models/DiseaseDetection.js
import mongoose from 'mongoose';

const DiseaseDetectionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  imageInfo: {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    uploadPath: { type: String }
  },
  analysisResults: {
    detected_diseases: [{
      disease_name: { type: String, required: true },
      confidence: { type: Number, required: true },
      severity: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
      crop_affected: { type: String, required: true },
      description: { type: String, required: true },
      symptoms: [String],
      treatment: [String],
      prevention: [String],
      recommended_products: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        price: { type: String, required: true }
      }]
    }],
    analysis_summary: {
      total_diseases_found: { type: Number, required: true },
      primary_disease: { type: String },
      overall_severity: { type: String },
      confidence_average: { type: Number }
    },
    image_quality: { type: String },
    processing_time: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.DiseaseDetection || 
  mongoose.model('DiseaseDetection', DiseaseDetectionSchema);
