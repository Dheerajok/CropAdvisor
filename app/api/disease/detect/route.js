// app/api/disease/detect/route.js
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import * as tf from '@tensorflow/tfjs-node';
import sharp from 'sharp';

// MongoDB connection
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

// Disease Detection Schema
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

const DiseaseDetection = mongoose.models.DiseaseDetection || 
  mongoose.model('DiseaseDetection', DiseaseDetectionSchema);

// Global model cache
let model = null;

// Load the TensorFlow.js model
async function loadModel() {
  if (!model) {
    try {
      console.log('Loading TensorFlow.js model...');
      const modelPath = path.join(process.cwd(), 'public', 'models', 'plant-disease-model', 'model.json');
      model = await tf.loadLayersModel(`file://${modelPath}`);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load disease detection model');
    }
  }
  return model;
}

// Class names from the Kaggle dataset (PlantVillage dataset)
const classNames = [
  'Apple___Apple_scab',
  'Apple___Black_rot',
  'Apple___Cedar_apple_rust',
  'Apple___healthy',
  'Blueberry___healthy',
  'Cherry_(including_sour)___Powdery_mildew',
  'Cherry_(including_sour)___healthy',
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
  'Corn_(maize)___Common_rust_',
  'Corn_(maize)___Northern_Leaf_Blight',
  'Corn_(maize)___healthy',
  'Grape___Black_rot',
  'Grape___Esca_(Black_Measles)',
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
  'Grape___healthy',
  'Orange___Haunglongbing_(Citrus_greening)',
  'Peach___Bacterial_spot',
  'Peach___healthy',
  'Pepper,_bell___Bacterial_spot',
  'Pepper,_bell___healthy',
  'Potato___Early_blight',
  'Potato___Late_blight',
  'Potato___healthy',
  'Raspberry___healthy',
  'Soybean___healthy',
  'Squash___Powdery_mildew',
  'Strawberry___Leaf_scorch',
  'Strawberry___healthy',
  'Tomato___Bacterial_spot',
  'Tomato___Early_blight',
  'Tomato___Late_blight',
  'Tomato___Leaf_Mold',
  'Tomato___Septoria_leaf_spot',
  'Tomato___Spider_mites Two-spotted_spider_mite',
  'Tomato___Target_Spot',
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  'Tomato___Tomato_mosaic_virus',
  'Tomato___healthy'
];

export async function POST(request) {
  const startTime = Date.now();
  
  try {
    await dbConnect();
    console.log('Disease Detection API: MongoDB Connected');

    const formData = await request.formData();
    const image = formData.get('image');
    const userId = formData.get('userId') || 'anonymous';

    if (!image) {
      return NextResponse.json(
        { success: false, message: 'No image uploaded' },
        { status: 400 }
      );
    }

    // Validate image type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      );
    }

    // Validate image size (max 10MB)
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'Image too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    console.log('Processing image:', image.name, 'Size:', image.size, 'Type:', image.type);

    // Save image to uploads directory
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.log('Uploads directory already exists or created');
    }

    // Generate unique filename
    const filename = `disease_${Date.now()}_${image.name}`;
    const filepath = path.join(uploadsDir, filename);
    
    await writeFile(filepath, buffer);
    console.log('Image saved successfully:', filename);

    // Load the ML model
    const mlModel = await loadModel();

    // Preprocess image and make prediction
    const prediction = await predictDisease(buffer, mlModel);
    
    // Convert prediction to disease information
    const analysisResults = await formatPredictionResults(prediction, buffer);
    
    // Calculate processing time
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(1) + ' seconds';
    analysisResults.processing_time = processingTime;

    // Save analysis to database
    const diseaseDetection = new DiseaseDetection({
      userId,
      imageInfo: {
        filename,
        originalName: image.name,
        size: image.size,
        mimeType: image.type
      },
      analysisResults
    });

    await diseaseDetection.save();
    console.log('Disease analysis saved to database');

    return NextResponse.json({
      success: true,
      data: analysisResults,
      detection_id: diseaseDetection._id,
      message: 'Disease analysis completed successfully'
    });

  } catch (error) {
    console.error('Disease Detection API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to analyze image for diseases',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// Preprocess image for the model
async function preprocessImage(imageBuffer) {
  try {
    // Resize image to model input size (typically 224x224 for plant disease models)
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(224, 224)
      .removeAlpha() // Remove alpha channel if present
      .raw()
      .toBuffer();

    // Convert to tensor and normalize (0-1 range)
    const tensor = tf.tensor3d(new Uint8Array(resizedImageBuffer), [224, 224, 3])
      .div(255.0)
      .expandDims(0); // Add batch dimension

    return tensor;
  } catch (error) {
    console.error('Image preprocessing error:', error);
    throw new Error('Failed to preprocess image');
  }
}

// Make prediction using the loaded model
async function predictDisease(imageBuffer, model) {
  try {
    console.log('Preprocessing image for prediction...');
    const preprocessedImage = await preprocessImage(imageBuffer);
    
    console.log('Making prediction...');
    const prediction = model.predict(preprocessedImage);
    
    // Get prediction probabilities
    const probabilities = await prediction.data();
    
    // Clean up tensors
    preprocessedImage.dispose();
    prediction.dispose();
    
    // Get top 3 predictions with confidence scores
    const topPredictions = Array.from(probabilities)
      .map((probability, index) => ({
        classIndex: index,
        className: classNames[index],
        confidence: probability * 100
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3); // Top 3 predictions

    console.log('Top predictions:', topPredictions);
    return topPredictions;

  } catch (error) {
    console.error('Prediction error:', error);
    throw new Error('Failed to make disease prediction');
  }
}

// Format ML predictions into detailed disease information
async function formatPredictionResults(predictions, imageBuffer) {
  const detectedDiseases = [];
  
  for (const prediction of predictions) {
    if (prediction.confidence > 10) { // Only include predictions with >10% confidence
      const diseaseInfo = await getDiseaseInformation(prediction);
      if (diseaseInfo) {
        detectedDiseases.push(diseaseInfo);
      }
    }
  }

  // If no diseases detected with sufficient confidence, return healthy status
  if (detectedDiseases.length === 0) {
    detectedDiseases.push({
      disease_name: "Healthy Plant",
      confidence: Math.max(...predictions.map(p => p.confidence)),
      severity: "None",
      crop_affected: "Unknown",
      description: "The plant appears to be healthy with no visible signs of disease.",
      symptoms: ["No disease symptoms detected"],
      treatment: ["Continue regular plant care"],
      prevention: ["Maintain good growing conditions"],
      recommended_products: []
    });
  }

  const analysisSummary = {
    total_diseases_found: detectedDiseases.filter(d => d.disease_name !== "Healthy Plant").length,
    primary_disease: detectedDiseases?.disease_name || 'Unknown',
    overall_severity: detectedDiseases?.severity || 'Low',
    confidence_average: Math.round(
      detectedDiseases.reduce((sum, disease) => sum + disease.confidence, 0) / detectedDiseases.length
    )
  };

  return {
    detected_diseases: detectedDiseases,
    analysis_summary: analysisSummary,
    image_quality: analyzeImageQuality(imageBuffer)
  };
}

// Get detailed disease information based on prediction
async function getDiseaseInformation(prediction) {
  const className = prediction.className;
  const confidence = Math.round(prediction.confidence);
  
  // Parse class name to extract crop and disease
  const parts = className.split('___');
  const crop = parts?.replace(/_/g, ' ');
  const disease = parts[2]?.replace(/_/g, ' ');
  
  if (disease === 'healthy') {
    return {
      disease_name: "Healthy Plant",
      confidence: confidence,
      severity: "None",
      crop_affected: crop,
      description: `The ${crop} plant appears to be healthy with no visible signs of disease.`,
      symptoms: ["No disease symptoms detected"],
      treatment: ["Continue regular plant care"],
      prevention: ["Maintain good growing conditions"],
      recommended_products: []
    };
  }

  // Disease database with detailed information
  const diseaseDatabase = {
    'Apple scab': {
      description: "Apple scab is a fungal disease caused by Venturia inaequalis that affects apple trees.",
      symptoms: ["Dark, scaly lesions on leaves", "Premature leaf drop", "Fruit spotting and cracking"],
      treatment: ["Apply fungicides during spring", "Remove fallen leaves", "Prune for air circulation"],
      prevention: ["Plant resistant varieties", "Avoid overhead watering", "Apply preventive sprays"],
      recommended_products: [
        { name: "Captan 50% WP", dosage: "2g/L", price: "₹180/250g" },
        { name: "Mancozeb 75% WP", dosage: "2.5g/L", price: "₹180/500g" }
      ]
    },
    'Late blight': {
      description: "Late blight is a destructive disease caused by Phytophthora infestans affecting tomatoes and potatoes.",
      symptoms: ["Dark brown lesions with white fungal growth", "Rapid plant death", "Fruit rot"],
      treatment: ["Apply copper fungicides immediately", "Remove infected plants", "Improve drainage"],
      prevention: ["Use resistant varieties", "Avoid overhead irrigation", "Apply preventive fungicides"],
      recommended_products: [
        { name: "Copper Oxychloride 50% WP", dosage: "2-3g/L", price: "₹120/250g" },
        { name: "Metalaxyl + Mancozeb", dosage: "2g/L", price: "₹250/250g" }
      ]
    },
    'Early blight': {
      description: "Early blight is caused by Alternaria solani and affects tomatoes, potatoes, and other solanaceous crops.",
      symptoms: ["Circular spots with concentric rings", "Yellowing leaves", "Premature defoliation"],
      treatment: ["Apply Mancozeb or Chlorothalonil", "Remove affected leaves", "Improve air circulation"],
      prevention: ["Space plants properly", "Avoid overhead watering", "Use mulch"],
      recommended_products: [
        { name: "Mancozeb 75% WP", dosage: "2.5g/L", price: "₹180/500g" },
        { name: "Chlorothalonil 75% WP", dosage: "2g/L", price: "₹200/250g" }
      ]
    },
    'Bacterial spot': {
      description: "Bacterial spot is caused by Xanthomonas species and affects various crops including tomatoes and peppers.",
      symptoms: ["Small dark spots with yellow halos", "Leaf yellowing and drop", "Fruit lesions"],
      treatment: ["Apply copper bactericides", "Remove infected material", "Improve air flow"],
      prevention: ["Use pathogen-free seeds", "Avoid wet conditions", "Practice crop rotation"],
      recommended_products: [
        { name: "Copper Hydroxide 77% WP", dosage: "3g/L", price: "₹140/500g" },
        { name: "Streptocycline", dosage: "0.5g/L", price: "₹85/10g" }
      ]
    }
    // Add more diseases as needed
  };

  // Find matching disease info
  const diseaseKey = Object.keys(diseaseDatabase).find(key => 
    disease.toLowerCase().includes(key.toLowerCase())
  );
  
  const diseaseInfo = diseaseDatabase[diseaseKey] || {
    description: `${disease} affecting ${crop} plants.`,
    symptoms: ["Visible disease symptoms on plant"],
    treatment: ["Consult local agricultural expert", "Apply appropriate fungicide"],
    prevention: ["Follow good agricultural practices", "Monitor plants regularly"],
    recommended_products: [
      { name: "General Fungicide", dosage: "As per label", price: "₹200/250g" }
    ]
  };

  // Determine severity based on confidence
  let severity = 'Low';
  if (confidence > 80) severity = 'High';
  else if (confidence > 60) severity = 'Medium';

  return {
    disease_name: disease,
    confidence: confidence,
    severity: severity,
    crop_affected: crop,
    description: diseaseInfo.description,
    symptoms: diseaseInfo.symptoms,
    treatment: diseaseInfo.treatment,
    prevention: diseaseInfo.prevention,
    recommended_products: diseaseInfo.recommended_products
  };
}

// Image quality analysis
function analyzeImageQuality(imageBuffer) {
  const size = imageBuffer.length;
  
  if (size > 500000) return 'Excellent';
  if (size > 200000) return 'Good';
  if (size > 100000) return 'Fair';
  return 'Poor';
}
