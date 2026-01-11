// TODO: Replace with actual API calls

export interface Farmer {
  name: string
  location: string
  currentCrop: string
  farmSize: number
}

export interface WeatherAlert {
  id: string
  type: "low" | "medium" | "high"
  title: string
  description: string
  date: string
  cropImpact: string
  suggestedAction: string
}

export interface AdvisoryDetail {
  advice: string
  reason: string
  confidence: number
}

export interface CropAdvisory {
  crop: string
  growthStage: string
  sowing: AdvisoryDetail
  irrigation: AdvisoryDetail
  fertilizer: AdvisoryDetail
}

export interface PricePrediction {
  crop: string
  mandi: string
  currentPrice: number
  predictedPrices: Array<{
    date: string
    price: number
  }>
  bestSellingWindow: {
    start: string
    end: string
  }
  recommendation: "sell" | "hold"
  volatility: "low" | "medium" | "high"
}

export interface ForecastDay {
  date: string
  temperature: { min: number; max: number }
  condition: string
  rainfall: number
  riskLevel: "low" | "medium" | "high"
}

export const mockFarmer: Farmer = {
  name: "Ramesh Kumar",
  location: "Bhopal, Madhya Pradesh",
  currentCrop: "Wheat",
  farmSize: 5.2,
}

export const mockFarmers: Farmer[] = [
  { name: "Ramesh Kumar", location: "Bhopal, Madhya Pradesh", currentCrop: "Wheat", farmSize: 5.2 },
  { name: "Suresh Patel", location: "Indore, Madhya Pradesh", currentCrop: "Soybean", farmSize: 8.5 },
  { name: "Vijay Singh", location: "Jabalpur, Madhya Pradesh", currentCrop: "Rice", farmSize: 3.7 },
  { name: "Kailash Verma", location: "Gwalior, Madhya Pradesh", currentCrop: "Wheat", farmSize: 6.0 },
  { name: "Prakash Yadav", location: "Ujjain, Madhya Pradesh", currentCrop: "Cotton", farmSize: 4.5 },
]

export const mockWeatherAlerts: WeatherAlert[] = [
  {
    id: "1",
    type: "high",
    title: "Heavy Rainfall Warning",
    description: "Expected 50-70mm rainfall in next 48 hours",
    date: "2024-01-10",
    cropImpact: "May damage standing wheat crop",
    suggestedAction: "Harvest early or provide drainage",
  },
  {
    id: "2",
    type: "medium",
    title: "Temperature Drop",
    description: "Temperature expected to drop to 8°C",
    date: "2024-01-12",
    cropImpact: "Frost risk for sensitive crops",
    suggestedAction: "Cover crops with protective sheets",
  },
  {
    id: "3",
    type: "low",
    title: "Optimal Weather Ahead",
    description: "Clear skies and moderate temperature expected for next 3 days",
    date: "2024-01-15",
    cropImpact: "Favorable for crop growth",
    suggestedAction: "Good time for fertilizer application",
  },
  {
    id: "4",
    type: "medium",
    title: "High Wind Alert",
    description: "Wind speeds up to 40 km/h expected",
    date: "2024-01-11",
    cropImpact: "May cause lodging in tall crops",
    suggestedAction: "Provide support to vulnerable plants",
  },
  {
    id: "5",
    type: "high",
    title: "Pest Attack Warning",
    description: "Aphid outbreak reported in neighboring districts",
    date: "2024-01-13",
    cropImpact: "High risk for wheat and mustard crops",
    suggestedAction: "Apply pesticide preventively",
  },
]

// Alert type mapping for translations
export const alertTypeKeys: Record<string, string> = {
  "Heavy Rainfall Warning": "heavyRainfall",
  "Temperature Drop": "temperatureDrop",
  "Optimal Weather Ahead": "optimalWeather",
  "High Wind Alert": "highWind",
  "Pest Attack Warning": "pestAttack",
}

export const mockCropAdvisory: CropAdvisory = {
  crop: "Wheat",
  growthStage: "Tillering",
  sowing: {
    advice: "Optimal sowing window has passed. Focus on irrigation and fertilization.",
    reason: "Sowing after November 25th reduces yield by 25kg/acre/day due to terminal heat stress.",
    confidence: 95
  },
  irrigation: {
    advice: "Water every 5-7 days. Current soil moisture is adequate.",
    reason: "Tillering stage is critical for crown root initiation. Water stress now leads to poor tillering.",
    confidence: 88
  },
  fertilizer: {
    advice: "Apply 50kg Urea per acre. Nitrogen is critical at this stage.",
    reason: "Plants need maximum Nitrogen during tillering for vegetative growth.",
    confidence: 92
  }
}

export const mockPricePrediction: PricePrediction = {
  crop: "Wheat",
  mandi: "Bhopal Mandi",
  currentPrice: 2450,
  predictedPrices: [
    { date: "2024-01-05", price: 2450 },
    { date: "2024-01-06", price: 2480 },
    { date: "2024-01-07", price: 2520 },
    { date: "2024-01-08", price: 2580 },
    { date: "2024-01-09", price: 2620 },
    { date: "2024-01-10", price: 2650 },
    { date: "2024-01-11", price: 2680 },
    { date: "2024-01-12", price: 2700 },
    { date: "2024-01-13", price: 2720 },
    { date: "2024-01-14", price: 2710 },
    { date: "2024-01-15", price: 2690 },
  ],
  bestSellingWindow: {
    start: "2024-01-12",
    end: "2024-01-14",
  },
  recommendation: "hold",
  volatility: "medium",
}

export const mockForecast: ForecastDay[] = [
  { date: "2024-01-05", temperature: { min: 12, max: 24 }, condition: "Sunny", rainfall: 0, riskLevel: "low" },
  { date: "2024-01-06", temperature: { min: 14, max: 26 }, condition: "Partly Cloudy", rainfall: 0, riskLevel: "low" },
  { date: "2024-01-07", temperature: { min: 15, max: 27 }, condition: "Sunny", rainfall: 0, riskLevel: "low" },
  { date: "2024-01-08", temperature: { min: 16, max: 28 }, condition: "Cloudy", rainfall: 2, riskLevel: "low" },
  { date: "2024-01-09", temperature: { min: 17, max: 26 }, condition: "Cloudy", rainfall: 5, riskLevel: "medium" },
  { date: "2024-01-10", temperature: { min: 10, max: 18 }, condition: "Heavy Rain", rainfall: 55, riskLevel: "high" },
  { date: "2024-01-11", temperature: { min: 8, max: 16 }, condition: "Light Rain", rainfall: 15, riskLevel: "medium" },
]

export const crops = ["Wheat", "Rice", "Cotton", "Sugarcane", "Maize", "Pulses"]

export const mandis = ["Bhopal Mandi", "Indore Mandi", "Jabalpur Mandi", "Gwalior Mandi"]

export const growthStages = ["Sowing", "Germination", "Tillering", "Flowering", "Grain Filling", "Maturity", "Harvested"]

export interface CommunityPost {
  id: string
  author: string
  avatar: string
  content: string
  likes: number
  comments: number
  time: string
  tags: string[]
}

export interface MarketplaceItem {
  id: string
  name: string
  price: number
  unit: string
  seller: string
  location: string
  image: string
  category: "seeds" | "fertilizers" | "equipment" | "produce"
}

export interface Scheme {
  id: string
  title: string
  description: string
  eligibility: string
  deadline: string
  benefit: string
  link: string
}

export interface FarmLogEntry {
  id: string
  date: string
  activity: string
  cost: number
  notes: string
  category: "labor" | "inputs" | "machinery" | "other"
}

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: "1",
    author: "Gurpreet Singh",
    avatar: "G",
    content: "Has anyone tried the new wheat variety HD-3086? How is the yield compared to HD-2967?",
    likes: 24,
    comments: 12,
    time: "2 hours ago",
    tags: ["Wheat", "Seeds"],
  },
  {
    id: "2",
    author: "Rajesh Kumar",
    avatar: "R",
    content: "Looking for a second-hand tractor (50HP). Please DM if selling.",
    likes: 15,
    comments: 5,
    time: "5 hours ago",
    tags: ["Equipment", "Buying"],
  },
  {
    id: "3",
    author: "Manoj Patel",
    avatar: "M",
    content: "Successfully controlled aphid attack using neem oil spray. Applied 5ml/liter water. Crop is recovering well!",
    likes: 42,
    comments: 18,
    time: "1 day ago",
    tags: ["Pest Control", "Organic", "Wheat"],
  },
  {
    id: "4",
    author: "Sunita Devi",
    avatar: "S",
    content: "Selling fresh organic vegetables from my farm. Tomato, brinjal, cauliflower available. Contact: 9876543210",
    likes: 31,
    comments: 9,
    time: "3 hours ago",
    tags: ["Selling", "Vegetables", "Organic"],
  },
  {
    id: "5",
    author: "Anil Sharma",
    avatar: "A",
    content: "Government has announced new subsidy for drip irrigation. 90% subsidy for small farmers. Apply soon!",
    likes: 67,
    comments: 23,
    time: "6 hours ago",
    tags: ["Government Scheme", "Irrigation"],
  },
  {
    id: "6",
    author: "Ravi Yadav",
    avatar: "R",
    content: "Got 22 quintals per acre wheat yield this season using DBW-187 variety. Very happy with results!",
    likes: 55,
    comments: 14,
    time: "2 days ago",
    tags: ["Wheat", "Success Story", "Yield"],
  },
  {
    id: "7",
    author: "Kavita Singh",
    avatar: "K",
    content: "Tips for new farmers: Always get soil tested before sowing. Saved me 40% on fertilizer costs this year!",
    likes: 89,
    comments: 31,
    time: "1 day ago",
    tags: ["Soil Health", "Tips", "Cost Saving"],
  },
  {
    id: "8",
    author: "Dinesh Kumar",
    avatar: "D",
    content: "Weather alert: Heavy rain expected tomorrow. Those planning to spray pesticides, please postpone.",
    likes: 38,
    comments: 7,
    time: "4 hours ago",
    tags: ["Weather", "Alert"],
  },
]

export const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: "1",
    name: "DAP Fertilizer",
    price: 1350,
    unit: "bag (50kg)",
    seller: "Kisan Sewa Kendra",
    location: "Bhopal",
    image: "https://placehold.co/100?text=DAP",
    category: "fertilizers",
  },
  {
    id: "2",
    name: "Wheat Seeds (HD-3086 Certified)",
    price: 40,
    unit: "kg",
    seller: "Punjab Agro",
    location: "Indore",
    image: "https://placehold.co/100?text=Wheat",
    category: "seeds",
  },
  {
    id: "3",
    name: "Rotavator 6ft",
    price: 95000,
    unit: "piece",
    seller: "Singh Implements",
    location: "Jabalpur",
    image: "https://placehold.co/100?text=Rotavator",
    category: "equipment",
  },
  {
    id: "4",
    name: "Organic Wheat 1st Grade",
    price: 2800,
    unit: "quintal",
    seller: "Ramesh Kumar",
    location: "Bhopal",
    image: "https://placehold.co/100?text=Wheat",
    category: "produce",
  },
  {
    id: "5",
    name: "Urea Fertilizer",
    price: 280,
    unit: "bag (45kg)",
    seller: "Kisan Sewa Kendra",
    location: "Gwalior",
    image: "https://placehold.co/100?text=Urea",
    category: "fertilizers",
  },
  {
    id: "6",
    name: "Rice Seeds (Pusa Basmati)",
    price: 85,
    unit: "kg",
    seller: "Madhya Pradesh Agro",
    location: "Ujjain",
    image: "https://placehold.co/100?text=Rice",
    category: "seeds",
  },
  {
    id: "7",
    name: "Tractor 50HP (2020 Model)",
    price: 485000,
    unit: "piece",
    seller: "Vijay Singh",
    location: "Indore",
    image: "https://placehold.co/100?text=Tractor",
    category: "equipment",
  },
  {
    id: "8",
    name: "Potash (MOP)",
    price: 890,
    unit: "bag (50kg)",
    seller: "Fertilizer Depot",
    location: "Bhopal",
    image: "https://placehold.co/100?text=Potash",
    category: "fertilizers",
  },
  {
    id: "9",
    name: "Cotton Seeds (BT Variety)",
    price: 950,
    unit: "packet (450g)",
    seller: "Modern Seeds Co.",
    location: "Gwalior",
    image: "https://placehold.co/100?text=Cotton",
    category: "seeds",
  },
  {
    id: "10",
    name: "Fresh Tomatoes",
    price: 25,
    unit: "kg",
    seller: "Sunita Devi",
    location: "Bhopal",
    image: "https://placehold.co/100?text=Tomato",
    category: "produce",
  },
  {
    id: "11",
    name: "Sprinkler System",
    price: 28000,
    unit: "set",
    seller: "Irrigation Solutions",
    location: "Indore",
    image: "https://placehold.co/100?text=Sprinkler",
    category: "equipment",
  },
  {
    id: "12",
    name: "Organic Compost",
    price: 150,
    unit: "bag (25kg)",
    seller: "Green Farm Inputs",
    location: "Jabalpur",
    image: "https://placehold.co/100?text=Compost",
    category: "fertilizers",
  },
]

export const mockSchemes: Scheme[] = [
  {
    id: "1",
    title: "PM Kisan Samman Nidhi",
    description: "Financial support of ₹6,000 per year to farmer families in three equal installments of ₹2,000 each, directly transferred to beneficiary bank accounts.",
    eligibility: "Small and marginal farmers owning cultivable land up to 2 hectares",
    deadline: "Open all year - Continuous enrollment",
    benefit: "₹6,000/year (₹2,000 per installment)",
    link: "https://pmkisan.gov.in/",
  },
  {
    id: "2",
    title: "Soil Health Card Scheme",
    description: "Issued once every two years to provide soil nutrient status and recommendations on appropriate dosage of nutrients to improve soil health and fertility.",
    eligibility: "All farmers across India",
    deadline: "Open all year - Register at nearest soil testing lab",
    benefit: "Free Soil Testing & Crop-wise Nutrient Recommendations",
    link: "https://soilhealth.dac.gov.in/",
  },
  {
    id: "3",
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "Comprehensive crop insurance covering yield losses from non-preventable risks like droughts, floods, pests, and diseases. Premium as low as 2% for Kharif and 1.5% for Rabi crops.",
    eligibility: "All farmers including sharecroppers and tenant farmers",
    deadline: "Register before sowing/planting season for respective crops",
    benefit: "Coverage up to sum insured amount with minimal premium",
    link: "https://pmfby.gov.in/",
  },
  {
    id: "4",
    title: "PM Kusum Yojana (Solar Pumps)",
    description: "Financial assistance for installation of standalone solar agriculture pumps (Component-B) and solarisation of existing grid-connected agriculture pumps (Component-C).",
    eligibility: "Individual farmers, farmer groups, FPOs, cooperatives, panchayats",
    deadline: "Apply through state nodal agencies - Check state deadlines",
    benefit: "30-40% Central subsidy + 30% State subsidy + 30% bank loan",
    link: "https://pmkusum.mnre.gov.in/",
  },
  {
    id: "5",
    title: "Kisan Credit Card (KCC)",
    description: "Short-term credit facility for farmers to meet crop production needs, post-harvest expenses, and consumption requirements. Interest subvention of 2% and prompt repayment incentive of 3%.",
    eligibility: "All farmers including tenant farmers and oral lessees",
    deadline: "Open all year - Apply at banks/cooperative societies",
    benefit: "4% effective interest rate (7% - 3% incentive)",
    link: "https://pmkisan.gov.in/KCC.aspx",
  },
  {
    id: "6",
    title: "Paramparagat Krishi Vikas Yojana (PKVY)",
    description: "Promotion of cluster-based organic farming with PGS certification. Cluster formation, capacity building, quality seed, organic manure, bio-fertilizers, and bio-pesticides support provided.",
    eligibility: "Cluster of 50 or more farmers cultivating 50 acres",
    deadline: "Apply through State Agriculture Department",
    benefit: "₹50,000 per hectare over 3 years (₹31,000 + ₹8,800 + ₹10,200)",
    link: "https://agricoop.nic.in/en/programmes/paramparagat-krishi-vikas-yojana-pkvy",
  },
  {
    id: "7",
    title: "National Agriculture Market (e-NAM)",
    description: "Pan-India electronic trading portal integrating existing APMCs into unified national market for agricultural commodities. Enables transparent price discovery and direct trading.",
    eligibility: "All farmers - Register with valid ID and bank account",
    deadline: "Open all year - Online registration at portal",
    benefit: "Better price discovery, transparent auctions, online payment",
    link: "https://www.enam.gov.in/web/",
  },
  {
    id: "8",
    title: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
    description: "Per Drop More Crop component: Financial assistance for micro irrigation (drip and sprinkler systems) to improve water use efficiency and increase crop productivity.",
    eligibility: "All farmers - Priority to small and marginal farmers",
    deadline: "Apply during subsidy window period at District Horticulture Office",
    benefit: "Small/Marginal: 55% | Other: 45% | NE States: 60% subsidy",
    link: "https://pmksy.gov.in/",
  },
  {
    id: "9",
    title: "Rashtriya Krishi Vikas Yojana (RKVY)",
    description: "State Plan Scheme for strengthening agriculture and allied sectors through flexible fund allocation for various agricultural activities and infrastructure development.",
    eligibility: "State Governments submit proposals - Benefits reach farmers",
    deadline: "Annual State submissions - Contact State Agriculture Dept",
    benefit: "Varies by project - Seeds, equipment, training, infrastructure",
    link: "https://rkvy.nic.in/",
  },
  {
    id: "10",
    title: "Sub-Mission on Agricultural Mechanization (SMAM)",
    description: "Promoting agricultural mechanization through financial assistance for farm machinery and equipment. Subsidy on tractors, power tillers, combine harvesters, etc.",
    eligibility: "Individual farmers, Custom Hiring Centres, FPOs, SHGs",
    deadline: "Apply through State Agriculture Department - Annual windows",
    benefit: "SC/ST/Small/Women: 50% | Others: 40% | CHC: Up to 80%",
    link: "https://agrimachinery.nic.in/",
  },
  {
    id: "11",
    title: "Mission for Integrated Development of Horticulture (MIDH)",
    description: "Holistic growth of horticulture sector covering fruits, vegetables, root & tuber crops, mushrooms, spices, flowers, aromatics, cashew, cocoa and bamboo.",
    eligibility: "Individual farmers, FPOs, SHGs, JLGs, government institutions",
    deadline: "Apply through State Horticulture Mission",
    benefit: "Planting material, protected cultivation, storage - 40-85% subsidy",
    link: "https://midh.gov.in/",
  },
  {
    id: "12",
    title: "Kisan Call Centre (KCC) - Toll Free Helpline",
    description: "24x7 toll-free helpline service in all Indian languages for immediate advice on farming queries, pest/disease management, weather, and government schemes.",
    eligibility: "All farmers across India",
    deadline: "Always available - Call 1800-180-1551",
    benefit: "Free expert advice on agriculture and allied activities",
    link: "https://dackkms.gov.in/",
  },
  {
    id: "13",
    title: "Mukhyamantri Kisan Kalyan Yojana (MP)",
    description: "Additional financial assistance of ₹4,000 per year by Madhya Pradesh Government, in addition to PM-KISAN. Total benefit: ₹10,000/year.",
    eligibility: "Farmers of Madhya Pradesh registered under PM-KISAN",
    deadline: "Open all year - Auto-enrolled if in PM-KISAN",
    benefit: "₹4,000/year (₹2,000 per installment) + PM-KISAN ₹6,000",
    link: "https://mpkrishi.mp.gov.in/",
  },
  {
    id: "14",
    title: "Bhavantar Bhugtan Yojana (MP Price Deficiency Payment)",
    description: "MP Government compensates farmers for the difference between MSP/Modal Price and actual market price for specified crops like soybean, maize, groundnut, etc.",
    eligibility: "Farmers of Madhya Pradesh selling notified crops",
    deadline: "Register during procurement season for each crop",
    benefit: "Compensation = (MSP - Market Price) × Quantity sold",
    link: "https://mpeuparjan.nic.in/",
  },
  {
    id: "15",
    title: "Pradhan Mantri Matsya Sampada Yojana (PMMSY)",
    description: "Sustainable development of fisheries sector with focus on fish production, productivity, quality, technology, post-harvest infrastructure and marketing.",
    eligibility: "Fishers, fish farmers, fish workers, fish vendors, SHGs, FPOs",
    deadline: "Apply through State Fisheries Department",
    benefit: "Beneficiary share 10% (General) / 5% (SC/ST/Women) - Rest subsidy",
    link: "https://pmmsy.dof.gov.in/",
  },
]

export const mockFarmLogs: FarmLogEntry[] = [
  {
    id: "1",
    date: "2024-01-05",
    activity: "Wheat Sowing",
    cost: 5000,
    notes: "Used 50kg seed per acre, HD-3086 variety",
    category: "inputs",
  },
  {
    id: "2",
    date: "2024-01-10",
    activity: "Irrigation Labor",
    cost: 1200,
    notes: "2 laborers for 1 day, flood irrigation",
    category: "labor",
  },
  {
    id: "3",
    date: "2024-01-12",
    activity: "DAP Fertilizer Application",
    cost: 6750,
    notes: "5 bags of DAP @ ₹1350 per bag",
    category: "inputs",
  },
  {
    id: "4",
    date: "2024-01-15",
    activity: "Tractor Ploughing",
    cost: 2500,
    notes: "Deep ploughing for 5 acres",
    category: "machinery",
  },
  {
    id: "5",
    date: "2024-01-18",
    activity: "Weed Control",
    cost: 1800,
    notes: "Manual weeding, 3 laborers for 1 day",
    category: "labor",
  },
  {
    id: "6",
    date: "2024-01-20",
    activity: "Urea Application",
    cost: 1680,
    notes: "6 bags of Urea @ ₹280 per bag",
    category: "inputs",
  },
  {
    id: "7",
    date: "2024-01-22",
    activity: "Pesticide Spray",
    cost: 2200,
    notes: "Aphid control spray, hired sprayer",
    category: "inputs",
  },
  {
    id: "8",
    date: "2024-01-25",
    activity: "Irrigation",
    cost: 800,
    notes: "Diesel for pump, 1 day irrigation",
    category: "other",
  },
  {
    id: "9",
    date: "2024-01-28",
    activity: "Soil Testing",
    cost: 0,
    notes: "Free soil health card testing at Krishi Vigyan Kendra",
    category: "other",
  },
  {
    id: "10",
    date: "2024-01-30",
    activity: "Labor for Fertilizer Spreading",
    cost: 900,
    notes: "Potash application, 2 laborers for half day",
    category: "labor",
  },
]
