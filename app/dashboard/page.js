'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    humidity: 65,
    rainfall: 12,
    windSpeed: 8,
    condition: 'Partly Cloudy'
  });
  const [farmStats, setFarmStats] = useState({
    totalLand: 25.5,
    activeCrops: 4,
    healthyFields: 95,
    pendingTasks: 8
  });
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'crop-recommendation', title: 'Rice recommendation completed', time: '2 hours ago', status: 'success' },
    { id: 2, type: 'disease-detection', title: 'Tomato late blight detected', time: '5 hours ago', status: 'warning' },
    { id: 3, type: 'fertilizer', title: 'NPK recommendation generated', time: '1 day ago', status: 'success' },
    { id: 4, type: 'guide', title: 'Wheat cultivation guide viewed', time: '2 days ago', status: 'info' }
  ]);

  const [quickStats, setQuickStats] = useState({
    cropsAnalyzed: 156,
    diseasesPrevented: 23,
    fertilizerSaved: '₹12,450',
    yieldIncrease: '18%'
  });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock function to simulate API calls for dashboard data
  useEffect(() => {
    // In real implementation, fetch actual data from APIs
    const fetchDashboardData = async () => {
      // Simulate API calls
      // setWeatherData(await fetchWeatherData());
      // setFarmStats(await fetchFarmStats());
      // setRecentActivities(await fetchRecentActivities());
    };
    fetchDashboardData();
  }, []);

  const getActivityIcon = (type) => {
    const icons = {
      'crop-recommendation': '🌾',
      'disease-detection': '🔍',
      'fertilizer': '🧪',
      'guide': '📚'
    };
    return icons[type] || '📊';
  };

  const getActivityColor = (status) => {
    const colors = {
      success: 'text-green-600 bg-green-50',
      warning: 'text-yellow-600 bg-yellow-50',
      error: 'text-red-600 bg-red-50',
      info: 'text-blue-600 bg-blue-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  const moduleCards = [
    {
      title: 'Smart Crop Recommendation',
      description: 'Get AI-powered crop suggestions based on soil and climate data',
      icon: '🌱',
      href: '/crop-recommendation',
      bgColor: 'from-green-400 to-green-600',
      stats: { label: 'Recommendations', value: '156' }
    },
    {
      title: 'Disease Detection',
      description: 'Identify plant diseases instantly using image analysis',
      icon: '🔬',
      href: '/disease-detection',
      bgColor: 'from-red-400 to-red-600',
      stats: { label: 'Diseases Detected', value: '23' }
    },
    {
      title: 'Fertilizer Recommendation',
      description: 'Optimize fertilizer usage with scientific recommendations',
      icon: '🧪',
      href: '/fertilizer',
      bgColor: 'from-blue-400 to-blue-600',
      stats: { label: 'Cost Saved', value: '₹12.4K' }
    },
    {
      title: 'Farming Guide',
      description: 'Access comprehensive farming guides and best practices',
      icon: '📚',
      href: '/farming-guide',
      bgColor: 'from-purple-400 to-purple-600',
      stats: { label: 'Guides Available', value: '50+' }
    }
  ];

  const upcomingTasks = [
    { id: 1, task: 'Apply fertilizer to wheat field', due: 'Today', priority: 'high', field: 'Field A' },
    { id: 2, task: 'Pest monitoring in tomato crops', due: 'Tomorrow', priority: 'medium', field: 'Field B' },
    { id: 3, task: 'Soil testing for next season', due: '3 days', priority: 'low', field: 'Field C' },
    { id: 4, task: 'Harvest maize crop', due: '1 week', priority: 'high', field: 'Field D' }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };
    return colors[priority] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 py-8">
      <div className="max-w-8xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome to Smart Farm Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                {currentTime.toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} • {currentTime.toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex space-x-3">
              <Link href="/crop-recommendation">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex items-center space-x-2">
                  <span>🌾</span>
                  <span>Quick Analysis</span>
                </button>
              </Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center space-x-2">
                <span>📊</span>
                <span>Reports</span>
              </button>
            </div>
          </div>
        </div>

        {/* Weather & Farm Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weather Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Today's Weather</h2>
              <div className="text-3xl">🌤️</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{weatherData.temperature}°C</div>
                <div className="text-sm text-gray-600">Temperature</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{weatherData.humidity}%</div>
                <div className="text-sm text-gray-600">Humidity</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600">{weatherData.rainfall}mm</div>
                <div className="text-sm text-gray-600">Rainfall</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{weatherData.windSpeed} km/h</div>
                <div className="text-sm text-gray-600">Wind Speed</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Today's Forecast:</span> {weatherData.condition} - Good conditions for field operations
              </p>
            </div>
          </div>

          {/* Farm Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Farm Overview</h2>
              <div className="text-3xl">🚜</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <div className="text-2xl font-bold text-emerald-600">{farmStats.totalLand}</div>
                <div className="text-sm text-gray-600">Total Land (acres)</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">{farmStats.activeCrops}</div>
                <div className="text-sm text-gray-600">Active Crops</div>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-xl">
                <div className="text-2xl font-bold text-teal-600">{farmStats.healthyFields}%</div>
                <div className="text-sm text-gray-600">Healthy Fields</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-600">{farmStats.pendingTasks}</div>
                <div className="text-sm text-gray-600">Pending Tasks</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Field Health Score</span>
                <span>{farmStats.healthyFields}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${farmStats.healthyFields}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🌾</div>
            <div className="text-2xl font-bold text-green-600">{quickStats.cropsAnalyzed}</div>
            <div className="text-sm text-gray-600">Crops Analyzed</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🛡️</div>
            <div className="text-2xl font-bold text-blue-600">{quickStats.diseasesPrevented}</div>
            <div className="text-sm text-gray-600">Diseases Prevented</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-yellow-600">{quickStats.fertilizerSaved}</div>
            <div className="text-sm text-gray-600">Fertilizer Saved</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-purple-600">{quickStats.yieldIncrease}</div>
            <div className="text-sm text-gray-600">Yield Increase</div>
          </div>
        </div>

        {/* Main Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {moduleCards.map((module, index) => (
            <Link key={index} href={module.href}>
              <div className="group cursor-pointer transform hover:scale-105 transition duration-300">
                <div className={`bg-gradient-to-br ${module.bgColor} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{module.icon}</div>
                    <div className="text-right">
                      <div className="text-sm opacity-90">{module.stats.label}</div>
                      <div className="text-2xl font-bold">{module.stats.value}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                  <p className="text-sm opacity-90 mb-4">{module.description}</p>
                  <div className="flex items-center text-sm font-medium">
                    <span>Get Started</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition duration-200">
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{activity.title}</div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.status)}`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Add Task</button>
            </div>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-gray-900 text-sm">{task.task}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{task.field}</span>
                    <span>Due: {task.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">💡</div>
            <h2 className="text-xl font-bold text-gray-900">Today's Farming Tip</h2>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-gray-700">
              <strong>Monsoon Preparation:</strong> With the current weather conditions showing high humidity ({weatherData.humidity}%), 
              ensure proper drainage in your fields to prevent waterlogging. Consider applying preventive fungicides 
              to protect crops from fungal diseases that thrive in humid conditions.
            </p>
          </div>
        </div>

        {/* Performance Charts Placeholder */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Crop Performance</h2>
            <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-gray-600">Performance charts will be displayed here</div>
                <div className="text-sm text-gray-500 mt-2">Integration with analytics coming soon</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Yield Trends</h2>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <div className="text-gray-600">Yield trend analysis will be shown here</div>
                <div className="text-sm text-gray-500 mt-2">Historical data integration in progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
