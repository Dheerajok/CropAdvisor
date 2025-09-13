'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function FarmingGuide() {
  const [selectedCategory, setSelectedCategory] = useState('crop-management');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedGuides, setBookmarkedGuides] = useState([]);
  const [expandedGuide, setExpandedGuide] = useState(null);

  const categories = [
    { id: 'crop-management', name: 'Crop Management', icon: '🌾', color: 'green' },
    { id: 'soil-health', name: 'Soil Health', icon: '🌱', color: 'brown' },
    { id: 'pest-control', name: 'Pest Control', icon: '🐛', color: 'red' },
    { id: 'irrigation', name: 'Irrigation', icon: '💧', color: 'blue' },
    { id: 'seasonal-farming', name: 'Seasonal Farming', icon: '🗓️', color: 'orange' },
    { id: 'organic-farming', name: 'Organic Farming', icon: '🌿', color: 'green' },
    { id: 'equipment-tools', name: 'Equipment & Tools', icon: '🚜', color: 'gray' },
    { id: 'post-harvest', name: 'Post Harvest', icon: '📦', color: 'purple' }
  ];

  const farmingGuides = {
    'crop-management': [
      {
        id: 1,
        title: 'Complete Rice Cultivation Guide',
        difficulty: 'Beginner',
        duration: '4-5 months',
        description: 'Comprehensive guide for growing rice from seedbed preparation to harvest',
        tags: ['Rice', 'Kharif', 'Water Management'],
        rating: 4.8,
        views: 15420,
        steps: [
          {
            phase: 'Land Preparation',
            duration: '2-3 weeks',
            activities: [
              'Clear field of weeds and crop residues',
              'Deep plowing to 15-20 cm depth',
              'Leveling and puddling for water retention',
              'Apply basal fertilizer (FYM 10 tons/hectare)'
            ]
          },
          {
            phase: 'Seedbed Preparation & Sowing',
            duration: '3-4 weeks',
            activities: [
              'Prepare nursery beds (1/10th of main field area)',
              'Soak seeds for 24 hours, then pre-germinate',
              'Sow seeds in raised beds with proper drainage',
              'Maintain 2-3 cm water level in nursery'
            ]
          },
          {
            phase: 'Transplanting',
            duration: '1 week',
            activities: [
              'Transplant 25-30 day old seedlings',
              'Maintain 20cm × 15cm spacing',
              'Plant 2-3 seedlings per hill',
              'Maintain 2-3 cm water level'
            ]
          },
          {
            phase: 'Field Management',
            duration: '10-12 weeks',
            activities: [
              'Apply nitrogen fertilizer in 3 splits',
              'Maintain proper water levels (2-5 cm)',
              'Regular weeding and pest monitoring',
              'Apply fungicides if disease symptoms appear'
            ]
          },
          {
            phase: 'Harvesting',
            duration: '1-2 weeks',
            activities: [
              'Harvest when 80-85% grains are golden yellow',
              'Cut crop 15-20 cm above ground level',
              'Dry grain to 14% moisture content',
              'Store in clean, dry containers'
            ]
          }
        ],
        tips: [
          'Monitor water pH levels (should be 6.0-7.0)',
          'Apply zinc sulfate if leaves show yellowing',
          'Use pheromone traps for stem borer control',
          'Maintain proper plant population (40-50 plants/m²)'
        ],
        commonMistakes: [
          'Overwatering during flowering stage',
          'Late transplanting (beyond 35 days)',
          'Inadequate weed control in early stages',
          'Harvesting too early or too late'
        ]
      },
      {
        id: 2,
        title: 'Wheat Farming Best Practices',
        difficulty: 'Beginner',
        duration: '4-5 months',
        description: 'Step-by-step guide for successful wheat cultivation in Rabi season',
        tags: ['Wheat', 'Rabi', 'Dry Land'],
        rating: 4.7,
        views: 12890,
        steps: [
          {
            phase: 'Pre-Sowing Preparation',
            duration: '2 weeks',
            activities: [
              'Deep plowing after monsoon season',
              'Apply farmyard manure (5-8 tons/hectare)',
              'Level the field for uniform sowing',
              'Prepare seed bed with fine tilth'
            ]
          },
          {
            phase: 'Sowing',
            duration: '1-2 weeks',
            activities: [
              'Sow seeds at 2-3 cm depth',
              'Maintain row spacing of 20-22.5 cm',
              'Use seed rate of 100-125 kg/hectare',
              'Apply basal dose of fertilizer'
            ]
          },
          {
            phase: 'Crop Management',
            duration: '12-14 weeks',
            activities: [
              'First irrigation at crown root initiation (20-25 DAS)',
              'Apply urea top dressing at tillering stage',
              'Monitor for rust diseases and aphids',
              'Apply fungicides if needed'
            ]
          },
          {
            phase: 'Harvesting & Storage',
            duration: '2 weeks',
            activities: [
              'Harvest when grain moisture is 20-25%',
              'Cut crop leaving 15 cm stubble',
              'Sun dry to reduce moisture to 12-14%',
              'Clean and store in moisture-proof containers'
            ]
          }
        ],
        tips: [
          'Choose certified seeds of high-yielding varieties',
          'Apply iron sulfate if yellowing occurs',
          'Use bird scarers during grain filling',
          'Monitor weather for timely harvesting'
        ],
        commonMistakes: [
          'Sowing too deep or too shallow',
          'Excessive irrigation leading to lodging',
          'Delayed harvesting causing grain shattering',
          'Inadequate drying before storage'
        ]
      },
      {
        id: 3,
        title: 'Tomato Cultivation for Commercial Production',
        difficulty: 'Intermediate',
        duration: '3-4 months',
        description: 'Advanced techniques for high-yield commercial tomato farming',
        tags: ['Tomato', 'Cash Crop', 'Protected Cultivation'],
        rating: 4.9,
        views: 8750,
        steps: [
          {
            phase: 'Variety Selection & Planning',
            duration: '1 week',
            activities: [
              'Choose hybrid varieties suitable for your climate',
              'Plan for year-round production with staggered planting',
              'Arrange for quality seeds and planting materials',
              'Design irrigation and support systems'
            ]
          },
          {
            phase: 'Nursery Management',
            duration: '4-5 weeks',
            activities: [
              'Prepare seedbeds with well-drained potting mix',
              'Sow seeds in protrays for better root development',
              'Maintain temperature at 25-30°C during germination',
              'Harden seedlings before transplanting'
            ]
          },
          {
            phase: 'Field Preparation & Transplanting',
            duration: '1-2 weeks',
            activities: [
              'Prepare raised beds 15-20 cm high',
              'Install drip irrigation system',
              'Transplant 4-5 week old seedlings',
              'Provide immediate support stakes'
            ]
          },
          {
            phase: 'Crop Care & Management',
            duration: '8-10 weeks',
            activities: [
              'Regular pruning of suckers and lower leaves',
              'Weekly fertigation through drip system',
              'Integrated pest and disease management',
              'Training plants on support systems'
            ]
          },
          {
            phase: 'Harvesting & Post-Harvest',
            duration: '6-8 weeks',
            activities: [
              'Harvest fruits at breaker to pink stage',
              'Grade fruits based on size and quality',
              'Pack in ventilated containers',
              'Store at 12-15°C for extended shelf life'
            ]
          }
        ],
        tips: [
          'Use mulching to conserve moisture and control weeds',
          'Monitor calcium levels to prevent blossom end rot',
          'Use pheromone traps for fruit borer control',
          'Harvest early morning for better fruit quality'
        ],
        commonMistakes: [
          'Overwatering leading to root diseases',
          'Poor pruning causing reduced fruit size',
          'Late blight management neglect',
          'Inadequate post-harvest handling'
        ]
      }
    ],
    'soil-health': [
      {
        id: 4,
        title: 'Soil Testing and Nutrient Management',
        difficulty: 'Beginner',
        duration: 'Ongoing',
        description: 'Learn how to test soil and manage nutrients for optimal crop growth',
        tags: ['Soil Testing', 'NPK', 'Organic Matter'],
        rating: 4.6,
        views: 11200,
        steps: [
          {
            phase: 'Soil Sample Collection',
            duration: '1 day',
            activities: [
              'Collect samples from 15-20 points across the field',
              'Take samples from 0-15 cm depth for most crops',
              'Mix samples thoroughly and take 1 kg composite sample',
              'Label and send to certified laboratory within 24 hours'
            ]
          },
          {
            phase: 'Understanding Soil Test Report',
            duration: '1 day',
            activities: [
              'Analyze pH levels (optimal: 6.0-7.5 for most crops)',
              'Check NPK availability and deficiency levels',
              'Assess organic carbon content (should be >0.5%)',
              'Review micronutrient status (Zn, Fe, B, Mn)'
            ]
          },
          {
            phase: 'Nutrient Management Planning',
            duration: '2-3 days',
            activities: [
              'Calculate fertilizer requirements based on soil test',
              'Plan organic matter incorporation (FYM/compost)',
              'Schedule fertilizer application timing',
              'Prepare micronutrient correction strategy'
            ]
          },
          {
            phase: 'Implementation & Monitoring',
            duration: 'Season-long',
            activities: [
              'Apply lime/gypsum for pH correction if needed',
              'Incorporate organic manures before planting',
              'Follow recommended fertilizer schedule',
              'Monitor plant growth and nutrient deficiency symptoms'
            ]
          }
        ],
        tips: [
          'Test soil every 2-3 years or when changing crops',
          'Collect samples at the same time each year',
          'Avoid sampling immediately after fertilizer application',
          'Keep detailed records of soil test results and amendments'
        ],
        commonMistakes: [
          'Taking samples from non-representative areas',
          'Mixing samples from different soil types',
          'Ignoring micronutrient deficiencies',
          'Over-fertilizing based on visual symptoms alone'
        ]
      },
      {
        id: 5,
        title: 'Composting and Organic Matter Management',
        difficulty: 'Beginner',
        duration: '3-6 months',
        description: 'Create nutrient-rich compost from farm and kitchen waste',
        tags: ['Composting', 'Organic Farming', 'Waste Management'],
        rating: 4.7,
        views: 9650,
        steps: [
          {
            phase: 'Material Collection',
            duration: '1-2 weeks',
            activities: [
              'Collect green materials (kitchen waste, fresh grass)',
              'Gather brown materials (dry leaves, straw, paper)',
              'Maintain 3:1 ratio of brown to green materials',
              'Avoid meat, dairy, and diseased plant materials'
            ]
          },
          {
            phase: 'Compost Pile Construction',
            duration: '1 day',
            activities: [
              'Choose well-drained location with partial shade',
              'Create layers alternating green and brown materials',
              'Add soil or finished compost as activator',
              'Ensure pile size is at least 3×3×3 feet'
            ]
          },
          {
            phase: 'Maintenance & Monitoring',
            duration: '3-4 months',
            activities: [
              'Turn pile every 2-3 weeks for aeration',
              'Maintain moisture like a wrung-out sponge',
              'Monitor temperature (should reach 130-160°F)',
              'Add materials to maintain proper C:N ratio'
            ]
          },
          {
            phase: 'Harvesting & Application',
            duration: '2-4 weeks',
            activities: [
              'Check for dark, crumbly, earth-smelling compost',
              'Screen through 1/2 inch mesh if needed',
              'Apply 2-4 inches around plants as mulch',
              'Incorporate into soil before planting new crops'
            ]
          }
        ],
        tips: [
          'Chop materials into smaller pieces for faster decomposition',
          'Cover pile to retain moisture and heat',
          'Use compost thermometer to monitor temperature',
          'Add lime if pile becomes too acidic (smells bad)'
        ],
        commonMistakes: [
          'Making pile too small (won\'t heat up properly)',
          'Adding too much green material (becomes slimy)',
          'Insufficient turning (takes much longer)',
          'Using diseased plant materials'
        ]
      }
    ],
    'pest-control': [
      {
        id: 6,
        title: 'Integrated Pest Management (IPM) Strategy',
        difficulty: 'Intermediate',
        duration: 'Season-long',
        description: 'Holistic approach to pest control using biological, cultural, and chemical methods',
        tags: ['IPM', 'Biological Control', 'Sustainable Farming'],
        rating: 4.8,
        views: 13450,
        steps: [
          {
            phase: 'Pest Monitoring & Identification',
            duration: 'Weekly',
            activities: [
              'Regular field scouting at least twice per week',
              'Use pheromone traps for early pest detection',
              'Maintain pest monitoring records with photos',
              'Identify beneficial insects and natural enemies'
            ]
          },
          {
            phase: 'Prevention & Cultural Control',
            duration: 'Pre-season',
            activities: [
              'Choose pest-resistant crop varieties',
              'Practice crop rotation to break pest cycles',
              'Maintain field sanitation and remove crop residues',
              'Use companion planting to deter pests naturally'
            ]
          },
          {
            phase: 'Biological Control Implementation',
            duration: 'Season-long',
            activities: [
              'Release beneficial insects (ladybugs, parasitic wasps)',
              'Use biological pesticides (Bt, NPV, Trichoderma)',
              'Install bird boxes and bee houses',
              'Maintain flowering borders to support beneficial insects'
            ]
          },
          {
            phase: 'Targeted Chemical Intervention',
            duration: 'As needed',
            activities: [
              'Use economic threshold levels before spraying',
              'Select selective pesticides that spare beneficials',
              'Rotate chemical classes to prevent resistance',
              'Follow proper application timing and techniques'
            ]
          }
        ],
        tips: [
          'Keep detailed records of pest populations and control measures',
          'Spray during early morning or evening to protect pollinators',
          'Use sticky traps to monitor flying pest populations',
          'Train farm workers to identify pests and beneficial insects'
        ],
        commonMistakes: [
          'Spraying pesticides on calendar schedule rather than need',
          'Using broad-spectrum pesticides that kill beneficials',
          'Ignoring pest resistance development',
          'Poor spray coverage and timing'
        ]
      }
    ],
    'irrigation': [
      {
        id: 7,
        title: 'Drip Irrigation System Setup and Management',
        difficulty: 'Intermediate',
        duration: '1-2 weeks setup',
        description: 'Complete guide to installing and managing efficient drip irrigation',
        tags: ['Drip Irrigation', 'Water Conservation', 'Fertigation'],
        rating: 4.9,
        views: 16780,
        steps: [
          {
            phase: 'System Planning & Design',
            duration: '2-3 days',
            activities: [
              'Calculate water requirements for different crops',
              'Map field layout and water source location',
              'Design mainline, sub-mainline, and lateral layout',
              'Select appropriate emitter discharge rates'
            ]
          },
          {
            phase: 'Installation',
            duration: '3-5 days',
            activities: [
              'Install water source connection and filtration system',
              'Lay mainlines and sub-mainlines with proper slopes',
              'Install laterals with emitters at plant spacing',
              'Set up fertilizer injection system'
            ]
          },
          {
            phase: 'System Testing & Calibration',
            duration: '1-2 days',
            activities: [
              'Check system pressure and flow rates',
              'Test emitter uniformity and distribution',
              'Calibrate fertigation system',
              'Program automated timers and controllers'
            ]
          },
          {
            phase: 'Operation & Maintenance',
            duration: 'Ongoing',
            activities: [
              'Daily monitoring of system pressure',
              'Weekly cleaning of filters',
              'Monthly emitter inspection and cleaning',
              'Seasonal system flushing and winterization'
            ]
          }
        ],
        tips: [
          'Install pressure compensating emitters for uniform flow',
          'Use mulching to reduce evaporation losses',
          'Monitor soil moisture with tensiometers',
          'Schedule irrigation based on crop growth stages'
        ],
        commonMistakes: [
          'Inadequate filtration causing emitter clogging',
          'Incorrect emitter spacing for crop requirements',
          'Over-irrigation leading to water logging',
          'Poor maintenance of system components'
        ]
      }
    ],
    'seasonal-farming': [
      {
        id: 8,
        title: 'Kharif Season Crop Planning',
        difficulty: 'Beginner',
        duration: 'June-November',
        description: 'Comprehensive guide for monsoon season farming success',
        tags: ['Kharif', 'Monsoon', 'Crop Planning'],
        rating: 4.6,
        views: 14320,
        steps: [
          {
            phase: 'Pre-Monsoon Preparation',
            duration: 'April-May',
            activities: [
              'Repair and maintain farm equipment',
              'Prepare seed bed and field drainage',
              'Procure quality seeds and fertilizers',
              'Plan crop layout based on water availability'
            ]
          },
          {
            phase: 'Early Kharif (June-July)',
            duration: '2 months',
            activities: [
              'Sow rice, cotton, sugarcane in main season',
              'Plant short-duration crops like maize, pearl millet',
              'Establish good drainage to prevent waterlogging',
              'Monitor weather for pest and disease outbreaks'
            ]
          },
          {
            phase: 'Mid-Kharif Management',
            duration: 'August-September',
            activities: [
              'Top-dress nitrogen fertilizer in rice and maize',
              'Manage excess water during heavy rainfall',
              'Control weeds before they compete with crops',
              'Monitor for pest attacks (especially stem borers)'
            ]
          },
          {
            phase: 'Late Kharif & Harvest',
            duration: 'October-November',
            activities: [
              'Harvest early-maturing crops like maize',
              'Drain excess water from rice fields',
              'Plan for post-harvest handling and storage',
              'Prepare fields for Rabi crop sowing'
            ]
          }
        ],
        tips: [
          'Choose varieties with good disease resistance',
          'Maintain proper plant population density',
          'Use resistant varieties in disease-prone areas',
          'Plan harvesting before late rains'
        ],
        commonMistakes: [
          'Late sowing missing optimal planting window',
          'Poor drainage leading to crop damage',
          'Inadequate pest monitoring during monsoon',
          'Delayed harvest causing quality deterioration'
        ]
      }
    ],
    'organic-farming': [
      {
        id: 9,
        title: 'Organic Certification Process Guide',
        difficulty: 'Intermediate',
        duration: '3 years transition',
        description: 'Step-by-step guide to obtain organic certification for your farm',
        tags: ['Organic Certification', 'NPOP', 'Documentation'],
        rating: 4.7,
        views: 7890,
        steps: [
          {
            phase: 'Pre-Conversion Planning',
            duration: '3-6 months',
            activities: [
              'Assess farm suitability for organic conversion',
              'Develop organic system plan (OSP)',
              'Select appropriate certification body',
              'Begin transition period documentation'
            ]
          },
          {
            phase: 'Conversion Period',
            duration: '2-3 years',
            activities: [
              'Implement organic practices completely',
              'Maintain detailed input and activity records',
              'Build soil fertility using organic methods',
              'Establish buffer zones from conventional farms'
            ]
          },
          {
            phase: 'Certification Application',
            duration: '3-6 months',
            activities: [
              'Submit application with required documents',
              'Undergo inspector visit and farm audit',
              'Address any non-compliances identified',
              'Receive certification decision'
            ]
          },
          {
            phase: 'Maintaining Certification',
            duration: 'Annual',
            activities: [
              'Annual renewal and inspector visits',
              'Continuous compliance with organic standards',
              'Update organic system plan as needed',
              'Participate in residue testing programs'
            ]
          }
        ],
        tips: [
          'Start documentation from day one of conversion',
          'Network with other organic farmers for support',
          'Plan marketing strategy for premium prices',
          'Consider group certification to reduce costs'
        ],
        commonMistakes: [
          'Inadequate record keeping during transition',
          'Using prohibited substances unknowingly',
          'Insufficient buffer zones from conventional areas',
          'Poor understanding of organic standards'
        ]
      }
    ],
    'equipment-tools': [
      {
        id: 10,
        title: 'Essential Farm Equipment Maintenance',
        difficulty: 'Intermediate',
        duration: 'Ongoing',
        description: 'Preventive maintenance guide for tractors and farm implements',
        tags: ['Tractor Maintenance', 'Farm Equipment', 'Preventive Care'],
        rating: 4.8,
        views: 10540,
        steps: [
          {
            phase: 'Daily Checks',
            duration: 'Before each use',
            activities: [
              'Check engine oil level and coolant',
              'Inspect tires for proper pressure and damage',
              'Test all lights and electrical systems',
              'Check hydraulic fluid levels'
            ]
          },
          {
            phase: 'Weekly Maintenance',
            duration: '2-3 hours',
            activities: [
              'Clean air filter and check for clogs',
              'Grease all lubrication points',
              'Check belt tension and condition',
              'Inspect implement connections and pins'
            ]
          },
          {
            phase: 'Monthly Service',
            duration: '4-6 hours',
            activities: [
              'Change engine oil and filter',
              'Check fuel system for leaks',
              'Inspect brake system operation',
              'Test PTO and hydraulic functions'
            ]
          },
          {
            phase: 'Seasonal Overhaul',
            duration: '1-2 days',
            activities: [
              'Complete engine service and tune-up',
              'Replace worn implements and components',
              'Check and adjust implement calibration',
              'Prepare equipment for storage'
            ]
          }
        ],
        tips: [
          'Keep maintenance log for warranty purposes',
          'Use genuine spare parts for critical components',
          'Train operators on proper equipment use',
          'Store equipment in covered, dry areas'
        ],
        commonMistakes: [
          'Skipping regular maintenance schedules',
          'Using wrong grade of oil or hydraulic fluid',
          'Ignoring minor problems until they become major',
          'Improper storage leading to rust and damage'
        ]
      }
    ],
    'post-harvest': [
      {
        id: 11,
        title: 'Grain Storage and Quality Management',
        difficulty: 'Beginner',
        duration: '6-12 months storage',
        description: 'Proper techniques for storing grains to prevent losses and maintain quality',
        tags: ['Grain Storage', 'Quality Control', 'Pest Management'],
        rating: 4.5,
        views: 8760,
        steps: [
          {
            phase: 'Pre-Storage Preparation',
            duration: '1-2 weeks',
            activities: [
              'Dry grain to safe moisture content (12-14%)',
              'Clean grain to remove foreign matter',
              'Inspect and repair storage structures',
              'Apply appropriate storage treatments'
            ]
          },
          {
            phase: 'Storage Operations',
            duration: '1-2 days',
            activities: [
              'Fill storage containers properly',
              'Apply storage protectants if needed',
              'Seal storage containers airtight',
              'Label with variety and storage date'
            ]
          },
          {
            phase: 'Monitoring & Management',
            duration: 'Monthly checks',
            activities: [
              'Monitor temperature and moisture levels',
              'Check for insect infestation signs',
              'Inspect for rodent activity',
              'Test grain quality parameters'
            ]
          },
          {
            phase: 'Quality Maintenance',
            duration: 'As needed',
            activities: [
              'Turn grain if moisture pockets develop',
              'Apply corrective treatments for pest problems',
              'Maintain storage environment conditions',
              'Prepare grain for marketing or processing'
            ]
          }
        ],
        tips: [
          'Use moisture meters to verify grain dryness',
          'Store different varieties separately',
          'Maintain first-in, first-out inventory system',
          'Keep detailed storage records'
        ],
        commonMistakes: [
          'Storing grain with high moisture content',
          'Poor storage structure maintenance',
          'Mixing old and new grain stocks',
          'Inadequate pest control measures'
        ]
      }
    ]
  };

  const toggleBookmark = (guideId) => {
    setBookmarkedGuides(prev => 
      prev.includes(guideId) 
        ? prev.filter(id => id !== guideId)
        : [...prev, guideId]
    );
  };

  const filteredGuides = farmingGuides[selectedCategory]?.filter(guide =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (color) => {
    const colors = {
      green: 'bg-green-500 hover:bg-green-600',
      brown: 'bg-amber-600 hover:bg-amber-700', 
      red: 'bg-red-500 hover:bg-red-600',
      blue: 'bg-blue-500 hover:bg-blue-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
      gray: 'bg-gray-500 hover:bg-gray-600',
      purple: 'bg-purple-500 hover:bg-purple-600'
    };
    return colors[color] || 'bg-green-500 hover:bg-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Smart Farming Guide</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Comprehensive agricultural guidance for modern farmers - from crop planning to harvest management
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search farming guides, topics, or techniques..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition duration-300 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? `${getCategoryColor(category.color)} text-white`
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-gray-600">Comprehensive Guides</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
            <div className="text-gray-600">Crop Varieties Covered</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">100K+</div>
            <div className="text-gray-600">Farmers Helped</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Farming Guides */}
        <div className="space-y-8">
          {filteredGuides.length > 0 ? (
            filteredGuides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Guide Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">{guide.title}</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(guide.difficulty)}`}>
                          {guide.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{guide.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{guide.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{guide.views.toLocaleString()} views</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4 fill-current text-yellow-400" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span>{guide.rating}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleBookmark(guide.id)}
                        className={`p-2 rounded-full transition duration-300 ${
                          bookmarkedGuides.includes(guide.id)
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                      >
                        {expandedGuide === guide.id ? 'Collapse' : 'View Guide'}
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {guide.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expanded Guide Content */}
                {expandedGuide === guide.id && (
                  <div className="p-6">
                    {/* Steps */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Step-by-Step Process</h3>
                      <div className="space-y-6">
                        {guide.steps.map((step, index) => (
                          <div key={index} className="border-l-4 border-green-500 pl-6">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                                {index + 1}
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800">{step.phase}</h4>
                              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm">{step.duration}</span>
                            </div>
                            <ul className="space-y-2 ml-11">
                              {step.activities.map((activity, actIndex) => (
                                <li key={actIndex} className="flex items-start space-x-2 text-gray-600">
                                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips and Common Mistakes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Pro Tips */}
                      <div className="bg-green-50 p-6 rounded-xl">
                        <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          Pro Tips
                        </h4>
                        <ul className="space-y-2">
                          {guide.tips.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2 text-green-700">
                              <span className="text-green-500 mt-1">💡</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Common Mistakes */}
                      <div className="bg-red-50 p-6 rounded-xl">
                        <h4 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          Common Mistakes to Avoid
                        </h4>
                        <ul className="space-y-2">
                          {guide.commonMistakes.map((mistake, index) => (
                            <li key={index} className="flex items-start space-x-2 text-red-700">
                              <span className="text-red-500 mt-1">⚠️</span>
                              <span>{mistake}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex space-x-4">
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download PDF Guide</span>
                      </button>
                      <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span>Share Guide</span>
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition duration-300 flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Ask Expert</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No guides found</h3>
              <p className="text-gray-500">Try adjusting your search or select a different category</p>
            </div>
          )}
        </div>

        {/* Resources Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Expert Knowledge</h3>
            <p className="text-gray-600 text-sm">
              All guides are developed by agricultural experts and experienced farmers with proven track records.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Practical Solutions</h3>
            <p className="text-gray-600 text-sm">
              Step-by-step guides with real-world applications suitable for Indian farming conditions and climate.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Always Updated</h3>
            <p className="text-gray-600 text-sm">
              Regularly updated content with latest farming techniques, technologies, and government schemes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
