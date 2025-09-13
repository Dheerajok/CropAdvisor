// pages/index.js or app/page.js (for App Router)
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-green-600">CropAdvisor</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-green-600 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                <Link href="/crop-recommendation" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">Crop Recommendation</Link>
                <Link href="/disease-detection" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">Disease Detection</Link>
                <Link href="/fertilizer" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">Fertilizer Guide</Link>
                <Link href="/weather" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">Weather</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Crop Advisory System
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Empowering small and marginal farmers with AI-powered agricultural insights for better crop yields and sustainable farming
            </p>
            <div className="space-x-4">
              <Link href="/get-started" className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
                Get Started
              </Link>
              <Link href="/learn-more" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition duration-300">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Farming Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced technology meets traditional farming wisdom to maximize your agricultural success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Smart Crop Recommendation */}
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Crop Recommendation</h3>
              <p className="text-gray-700 mb-6">
                AI-powered analysis of soil conditions, climate data, and market trends to recommend the most suitable crops for your land.
              </p>
              <Link href="/crop-recommendation" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300">
                Explore Crops
              </Link>
            </div>

            {/* Plant Disease Detection */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Plant Disease Identification</h3>
              <p className="text-gray-700 mb-6">
                Upload plant images for instant disease detection using advanced computer vision and machine learning models.
              </p>
              <Link href="/disease-detection" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                Detect Disease
              </Link>
            </div>

            {/* Fertilizer Recommendation */}
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fertilizer Recommendation</h3>
              <p className="text-gray-700 mb-6">
                Get personalized fertilizer recommendations based on soil analysis, crop type, and growth stage requirements.
              </p>
              <Link href="/fertilizer" className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition duration-300">
                Get Recommendations
              </Link>
            </div>

            {/* Weather Forecast */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Weather Forecast</h3>
              <p className="text-gray-700 mb-6">
                Access accurate weather predictions and alerts to plan your farming activities and protect your crops.
              </p>
              <Link href="/weather" className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition duration-300">
                View Weather
              </Link>
            </div>

            {/* Smart Farming Guide */}
            <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Farming Guide</h3>
              <p className="text-gray-700 mb-6">
                Comprehensive farming knowledge base with best practices, seasonal calendars, and expert agricultural advice.
              </p>
              <Link href="/farming-guide" className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition duration-300">
                Access Guide
              </Link>
            </div>

            {/* User-Friendly Interface */}
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">User-Friendly Interface</h3>
              <p className="text-gray-700 mb-6">
                Intuitive design optimized for farmers with multilingual support and easy-to-use mobile interface.
              </p>
              <Link href="/dashboard" className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition duration-300">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-green-200">Farmers Helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-green-200">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-green-200">Crop Varieties</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-green-200">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">CropAdvisor</h3>
              <p className="text-gray-400">
                Empowering farmers with intelligent agricultural solutions for sustainable and profitable farming.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/crop-recommendation" className="hover:text-white">Crop Recommendation</Link></li>
                <li><Link href="/disease-detection" className="hover:text-white">Disease Detection</Link></li>
                <li><Link href="/fertilizer" className="hover:text-white">Fertilizer Guide</Link></li>
                <li><Link href="/weather" className="hover:text-white">Weather Forecast</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 mb-2">Email: digitalberojgarwork@gmail.com</p>
              <p className="text-gray-400">Phone: +91 XXXXX XXXXX</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CropAdvisor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
