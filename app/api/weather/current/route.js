// app/api/weather/current/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { message: 'Latitude and longitude required' },
      { status: 400 }
    );
  }

  try {
    const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    // Format weather data for crop recommendation
    const formattedWeatherData = {
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      rainfall: weatherData.rain ? weatherData.rain['1h'] || 0 : 0,
      wind_speed: weatherData.wind.speed,
      visibility: weatherData.visibility,
      weather_condition: weatherData.weather.main,
      description: weatherData.weather.description
    };

    return NextResponse.json({
      success: true,
      data: formattedWeatherData,
      location: {
        city: weatherData.name,
        country: weatherData.sys.country,
        coordinates: { lat: weatherData.coord.lat, lon: weatherData.coord.lon }
      }
    });
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch weather data',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
