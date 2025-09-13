// app/api/disease/history/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// MongoDB connection (same as above)
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

// Disease Detection Schema (same as above)
const DiseaseDetectionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  imageInfo: {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true }
  },
  analysisResults: {
    detected_diseases: [{
      disease_name: { type: String, required: true },
      confidence: { type: Number, required: true },
      severity: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
      crop_affected: { type: String, required: true }
    }],
    analysis_summary: {
      total_diseases_found: { type: Number, required: true },
      primary_disease: { type: String },
      overall_severity: { type: String },
      confidence_average: { type: Number }
    }
  },
  createdAt: { type: Date, default: Date.now }
});

const DiseaseDetection = mongoose.models.DiseaseDetection || 
  mongoose.model('DiseaseDetection', DiseaseDetectionSchema);

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'anonymous';
    const limit = parseInt(searchParams.get('limit')) || 10;

    const history = await DiseaseDetection
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('analysisResults.analysis_summary createdAt imageInfo.originalName');

    return NextResponse.json({
      success: true,
      data: history,
      count: history.length
    });

  } catch (error) {
    console.error('Disease History API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch disease detection history',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
