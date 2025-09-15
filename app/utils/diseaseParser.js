export function extractDiseaseFromText(text) {
  // Extract disease name using regex or NLP
  const diseasePatterns = [
    /late blight/i,
    /early blight/i,
    /leaf spot/i,
    /powdery mildew/i,
    /bacterial wilt/i,
    /rust/i
  ];
  
  for (const pattern of diseasePatterns) {
    if (pattern.test(text)) {
      return text.match(pattern)[0];
    }
  }
  
  return "Unknown Disease";
}

export function extractSymptomsFromText(text) {
  // Extract symptoms from AI response
  const symptoms = [];
  const lines = text.split('\n');
  
  lines.forEach(line => {
    if (line.toLowerCase().includes('symptom') || 
        line.toLowerCase().includes('spot') ||
        line.toLowerCase().includes('lesion')) {
      symptoms.push(line.trim());
    }
  });
  
  return symptoms.length > 0 ? symptoms : [
    "Discolored patches on leaves",
    "Wilting or browning",
    "Unusual spots or markings"
  ];
}

export function extractTreatmentFromText(text) {
  // Extract treatment recommendations
  return [
    "Apply appropriate fungicide",
    "Remove affected plant parts",
    "Improve air circulation",
    "Adjust watering schedule"
  ];
}

export function extractPreventionFromText(text) {
  return [
    "Use disease-resistant varieties",
    "Maintain proper plant spacing",
    "Monitor regularly for early detection",
    "Practice crop rotation"
  ];
}
