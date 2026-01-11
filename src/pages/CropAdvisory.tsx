import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Info, 
  Droplets, 
  Flower, 
  Lightbulb, 
  MessageCircle, 
  Send, 
  X, 
  Languages, 
  Bot,
  Loader2,
  Check,
  Clock,
  Mic,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  BookOpen,
  Users,
  HelpCircle,
  Volume2,
  BookmarkPlus,
  CloudRain,
  TrendingUp,
  IndianRupee,
  Sprout,
  Leaf,
  Sparkles
} from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { mockCropAdvisory, crops, growthStages, mockWeatherAlerts, mockFarmer } from "../data/mockData"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

// Enhanced Advisory Card Component
const AdvisoryCard = ({ 
  title, 
  icon: Icon, 
  data, 
  colorClass, 
  bgClass,
  priority,
  weatherContext,
  costImpact,
  yieldImpact,
  onMarkDone,
  onRemind,
  onAddToLog,
  onVoiceRead,
  isDone,
  selectedLanguage
}: { 
  title: string, 
  icon: React.ElementType, 
  data: { advice: string, reason: string, confidence: number },
  colorClass: string,
  bgClass: string,
  priority: "critical" | "moderate" | "optional",
  weatherContext?: string,
  costImpact: number,
  yieldImpact: number,
  onMarkDone: () => void,
  onRemind: () => void,
  onAddToLog: () => void,
  onVoiceRead: () => void,
  isDone: boolean,
  selectedLanguage: string
}) => {
  const [showExplanation, setShowExplanation] = useState(false)
  const [showReminderPicker, setShowReminderPicker] = useState(false)
  const [reminderDate, setReminderDate] = useState("")
  const { t } = useTranslation()

  const priorityColors = {
    critical: "bg-red-500 text-white",
    moderate: "bg-amber-500 text-white", 
    optional: "bg-blue-500 text-white"
  }

  return (
    <Card className={`h-full hover:shadow-xl transition-all overflow-hidden ${isDone ? 'opacity-70 border-green-500' : ''}`}>
      <div className={`h-1 w-full ${bgClass}`} />
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`rounded-lg ${bgClass} p-2 bg-opacity-20`}>
              <Icon className={`h-5 w-5 ${colorClass}`} />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={priorityColors[priority]}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onVoiceRead}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Read aloud in {selectedLanguage}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${colorClass} border-current`}>
                  {data.confidence}% Reliability
                </Badge>
                <HelpCircle className="h-3 w-3 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Reliability score indicates confidence based on historical data, weather patterns, and soil conditions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Advice */}
        <div>
          <p className="text-base font-medium mb-2">{data.advice}</p>
          
          {/* Weather Context */}
          {weatherContext && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-start gap-2 p-2 rounded-md bg-blue-50 border border-blue-200 mb-3"
            >
              <CloudRain className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-800">{weatherContext}</p>
            </motion.div>
          )}
          
          {/* Cost & Yield Impact */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <IndianRupee className="h-3 w-3" />
              <span className="font-medium">₹{costImpact}/acre</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span className="font-medium">+{yieldImpact}% yield</span>
            </div>
          </div>
          
          {/* Expandable AI Explanation */}
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🧠</span>
                <span className="text-sm font-semibold">Why this advice? (AI-based)</span>
              </div>
              {showExplanation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-muted/20 text-sm text-muted-foreground">
                    {data.reason}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Reliability Score</span>
            <span>{data.confidence}/100</span>
          </div>
          <Progress value={data.confidence} className="h-2" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={isDone ? "default" : "outline"}
              size="sm"
              onClick={onMarkDone}
              className="w-full"
            >
              <Check className="h-4 w-4 mr-1" />
              {isDone ? "Completed" : "Mark Done"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReminderPicker(!showReminderPicker)}
              className="w-full"
            >
              <Clock className="h-4 w-4 mr-1" />
              Remind Me
            </Button>
          </div>
          
          {/* Reminder Date Picker */}
          <AnimatePresence>
            {showReminderPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex gap-2 overflow-hidden"
              >
                <Input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="text-sm"
                  min={new Date().toISOString().split('T')[0]}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (reminderDate) {
                      onRemind()
                      setShowReminderPicker(false)
                      setReminderDate("")
                    }
                  }}
                >
                  Set
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onAddToLog}
            className="w-full"
          >
            <BookmarkPlus className="h-4 w-4 mr-1" />
            Add to Farm Log
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function CropAdvisory() {
  const [selectedCrop, setSelectedCrop] = useState(crops[0])
  const [selectedStage, setSelectedStage] = useState(growthStages[2])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatLanguage, setChatLanguage] = useState("English")
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([
    { role: 'bot', content: 'Namaste! I am your AI Crop Assistant. How can I help you today?' }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // New state for action tracking
  const [completedActions, setCompletedActions] = useState<{[key: string]: boolean}>({
    sowing: false,
    irrigation: false,
    fertilizer: false
  })
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  const { t, i18n } = useTranslation()
  
  // Detect post-harvest / empty land condition
  const isPostHarvest = selectedStage === "Maturity" || selectedStage === "Harvested"
  
  // Cover crop recommendations based on season and region
  const coverCrops = [
    {
      name: t('cropAdvisory.postHarvest.crops.dhaincha.name'),
      duration: "30-40 " + t('cropAdvisory.postHarvest.days'),
      benefits: [
        t('cropAdvisory.postHarvest.crops.dhaincha.benefit1'),
        t('cropAdvisory.postHarvest.crops.dhaincha.benefit2'),
        t('cropAdvisory.postHarvest.crops.dhaincha.benefit3')
      ],
      icon: Sprout,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      name: t('cropAdvisory.postHarvest.crops.sunhemp.name'),
      duration: "35-45 " + t('cropAdvisory.postHarvest.days'),
      benefits: [
        t('cropAdvisory.postHarvest.crops.sunhemp.benefit1'),
        t('cropAdvisory.postHarvest.crops.sunhemp.benefit2'),
        t('cropAdvisory.postHarvest.crops.sunhemp.benefit3')
      ],
      icon: Leaf,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      name: t('cropAdvisory.postHarvest.crops.moong.name'),
      duration: "60-65 " + t('cropAdvisory.postHarvest.days'),
      benefits: [
        t('cropAdvisory.postHarvest.crops.moong.benefit1'),
        t('cropAdvisory.postHarvest.crops.moong.benefit2'),
        t('cropAdvisory.postHarvest.crops.moong.benefit3')
      ],
      icon: Sparkles,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ]

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI("AIzaSyACMEIJf8h-KI7jo3lZcr2oR3BQVzAnVgE")

  const suggestions = [
    "Pest control for Wheat?",
    "Best time to water?",
    "Fertilizer dosage?"
  ]
  
  // Voice synthesis helper
  const speakText = (text: string, lang: string = "en-US") => {
    if (!('speechSynthesis' in window)) {
      alert('Voice feature not supported in this browser')
      return
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    
    // Map UI language to speech synthesis language codes
    const langMap: {[key: string]: string} = {
      "English": "en-US",
      "Hindi": "hi-IN",
      "Punjabi": "pa-IN",
      "Marathi": "mr-IN",
      "Tamil": "ta-IN",
      "Telugu": "te-IN",
      "Gujarati": "gu-IN",
      "Bengali": "bn-IN",
      "Kannada": "kn-IN"
    }
    
    utterance.lang = langMap[lang] || "en-US"
    utterance.rate = 0.9
    utterance.pitch = 1
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    window.speechSynthesis.speak(utterance)
  }
  
  // Calculate risk level based on weather alerts
  const getRiskLevel = (): "low" | "medium" | "high" => {
    const highRiskAlerts = mockWeatherAlerts.filter(a => a.type === "high")
    const mediumRiskAlerts = mockWeatherAlerts.filter(a => a.type === "medium")
    
    if (highRiskAlerts.length > 0) return "high"
    if (mediumRiskAlerts.length > 0) return "medium"
    return "low"
  }
  
  // Get next recommended action
  const getNextAction = () => {
    if (!completedActions.sowing) return "Sowing Review"
    if (!completedActions.irrigation) return "Irrigation"
    if (!completedActions.fertilizer) return "Fertilizer Application"
    return "All tasks completed"
  }
  
  // Get weather context for specific advisory
  const getWeatherContext = (advisoryType: string): string | undefined => {
    const upcomingAlert = mockWeatherAlerts[0]
    
    if (advisoryType === "irrigation" && upcomingAlert?.type === "high") {
      return `⚠️ ${upcomingAlert.title} - ${upcomingAlert.description}. Consider delaying irrigation.`
    }
    
    if (advisoryType === "fertilizer" && upcomingAlert?.description.includes("rain")) {
      return `Rain expected - Apply fertilizer after rainfall to maximize absorption.`
    }
    
    return undefined
  }
  
  // Action handlers
  const handleMarkDone = (actionType: string) => {
    setCompletedActions(prev => ({
      ...prev,
      [actionType]: !prev[actionType]
    }))
    
    // In production, this would call API to log the action
    console.log(`Marked ${actionType} as done`)
  }
  
  const handleRemind = (actionType: string) => {
    // In production, this would set up a reminder via API/notification service
    alert(`Reminder set for ${actionType}`)
    console.log(`Reminder set for ${actionType}`)
  }
  
  const handleAddToLog = (actionType: string, advice: string) => {
    // In production, this would add entry to farm log via API
    const logEntry = {
      date: new Date().toISOString(),
      crop: selectedCrop,
      stage: selectedStage,
      action: actionType,
      recommendation: advice
    }
    
    console.log("Adding to farm log:", logEntry)
    alert(`Added ${actionType} to Farm Log`)
  }
  
  const handleVoiceRead = (title: string, advice: string, reason: string) => {
    const fullText = `${title}. ${advice}. Explanation: ${reason}`
    speakText(fullText, chatLanguage)
  }

  const handleSendMessage = async (text: string = inputMessage) => {
    if (!text.trim()) return
    
    // Add user message
    const userMessage = { role: 'user' as const, content: text }
    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    
    try {
      // Get Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })
      
      // Context for the AI
      const context = `You are Kisan Sahayak, an expert agricultural AI assistant for Indian farmers. 
      Current Context:
      - Selected Crop: ${selectedCrop}
      - Growth Stage: ${selectedStage}
      - User Language Preference: ${chatLanguage}
      
      Please provide helpful, practical advice for farmers. Keep answers concise and easy to understand.`
      
      const prompt = `${context}\n\nUser Question: ${text}`
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const textResponse = response.text()

      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: textResponse 
      }])
    } catch (error: any) {
      console.error("Error calling Gemini API:", error)
      console.error("Error details:", error?.message, error?.response)
      
      let errorMessage = "I apologize, but I'm having trouble right now. "
      
      if (error?.message?.includes('API key')) {
        errorMessage = "There's an issue with the API key. Please check if it's valid."
      } else if (error?.message?.includes('quota')) {
        errorMessage = "The API quota has been exceeded. Please try again later."
      } else if (error?.message?.includes('404')) {
        errorMessage = "The AI model is not available. Please contact support."
      } else {
        errorMessage += error?.message || "Please try again."
      }
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: errorMessage
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-200px)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2 text-3xl font-bold">Crop Advisory</h1>
        <p className="text-muted-foreground">
          AI-powered personalized recommendations for your farm
        </p>
      </motion.div>
      
      {/* Top Summary Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center gap-2">
                <Flower className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Crop</p>
                  <p className="font-semibold">{selectedCrop}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Growth Stage</p>
                  <p className="font-semibold">{selectedStage}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-semibold text-sm">{mockFarmer.location.split(',')[0]}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`h-5 w-5 rounded-full ${
                  getRiskLevel() === 'high' ? 'bg-red-500' : 
                  getRiskLevel() === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                }`} />
                <div>
                  <p className="text-xs text-muted-foreground">Risk Level</p>
                  <p className={`font-semibold capitalize ${
                    getRiskLevel() === 'high' ? 'text-red-600' : 
                    getRiskLevel() === 'medium' ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {getRiskLevel()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Next Action</p>
                  <p className="font-semibold text-sm">{getNextAction()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Selectors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Crop</label>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {crops.map((crop) => (
                <SelectItem key={crop} value={crop}>{crop}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Growth Stage</label>
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {growthStages.map((stage) => (
                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>
      
      {/* Community Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <Link to={`/dashboard/community?crop=${selectedCrop}&stage=${selectedStage}`}>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <p className="text-sm font-medium">
                  See how other farmers handled <span className="font-bold">{selectedStage}</span> stage
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-purple-600 rotate-[-90deg]" />
            </CardContent>
          </Card>
        </Link>
      </motion.div>
      
      {/* Post-Harvest Soil Health Advisory */}
      {isPostHarvest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-600 rounded-xl">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl text-green-900">
                    {t('cropAdvisory.postHarvest.title')}
                  </CardTitle>
                  <p className="text-sm text-green-700 mt-1">
                    {t('cropAdvisory.postHarvest.subtitle')}
                  </p>
                </div>
                <Badge className="bg-green-600 hover:bg-green-600 text-white">
                  {t('cropAdvisory.postHarvest.badge')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/60 rounded-lg p-4 border border-green-200">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {t('cropAdvisory.postHarvest.description')}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3">
                  {t('cropAdvisory.postHarvest.recommendedCrops')}
                </h4>
                <div className="grid gap-3 md:grid-cols-3">
                  {coverCrops.map((crop, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Card className="border-2 hover:border-green-400 hover:shadow-lg transition-all cursor-pointer h-full">
                        <CardContent className="p-4">
                          <div className={`p-2 ${crop.bgColor} rounded-lg w-fit mb-3`}>
                            <crop.icon className={`h-5 w-5 ${crop.color}`} />
                          </div>
                          <h5 className="font-bold text-gray-900 mb-1">{crop.name}</h5>
                          <div className="flex items-center gap-1 mb-3">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-600 font-medium">{crop.duration}</span>
                          </div>
                          <ul className="space-y-1.5">
                            {crop.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-700">
                                <Check className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                                <span className="leading-relaxed">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border border-green-300">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-green-700" />
                  <h4 className="font-semibold text-sm text-green-900">
                    {t('cropAdvisory.postHarvest.actionTitle')}
                  </h4>
                </div>
                <p className="text-sm text-green-800 leading-relaxed">
                  {t('cropAdvisory.postHarvest.actionText')}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Advisory Cards Grid */}
      {!isPostHarvest && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AdvisoryCard 
            title="Sowing Advice" 
            icon={Flower} 
            data={mockCropAdvisory.sowing}
            colorClass="text-green-600"
            bgClass="bg-green-600"
            priority="moderate"
            weatherContext={getWeatherContext("sowing")}
            costImpact={500}
            yieldImpact={5}
            onMarkDone={() => handleMarkDone("sowing")}
            onRemind={() => handleRemind("sowing")}
            onAddToLog={() => handleAddToLog("Sowing", mockCropAdvisory.sowing.advice)}
            onVoiceRead={() => handleVoiceRead("Sowing Advice", mockCropAdvisory.sowing.advice, mockCropAdvisory.sowing.reason)}
            isDone={completedActions.sowing}
            selectedLanguage={chatLanguage}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AdvisoryCard 
            title="Irrigation" 
            icon={Droplets} 
            data={mockCropAdvisory.irrigation}
            colorClass="text-blue-600"
            bgClass="bg-blue-600"
            priority="critical"
            weatherContext={getWeatherContext("irrigation")}
            costImpact={300}
            yieldImpact={15}
            onMarkDone={() => handleMarkDone("irrigation")}
            onRemind={() => handleRemind("irrigation")}
            onAddToLog={() => handleAddToLog("Irrigation", mockCropAdvisory.irrigation.advice)}
            onVoiceRead={() => handleVoiceRead("Irrigation", mockCropAdvisory.irrigation.advice, mockCropAdvisory.irrigation.reason)}
            isDone={completedActions.irrigation}
            selectedLanguage={chatLanguage}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-2 lg:col-span-1"
        >
          <AdvisoryCard 
            title="Fertilizer" 
            icon={Lightbulb} 
            data={mockCropAdvisory.fertilizer}
            colorClass="text-amber-600"
            bgClass="bg-amber-600"
            priority="critical"
            weatherContext={getWeatherContext("fertilizer")}
            costImpact={1200}
            yieldImpact={20}
            onMarkDone={() => handleMarkDone("fertilizer")}
            onRemind={() => handleRemind("fertilizer")}
            onAddToLog={() => handleAddToLog("Fertilizer", mockCropAdvisory.fertilizer.advice)}
            onVoiceRead={() => handleVoiceRead("Fertilizer", mockCropAdvisory.fertilizer.advice, mockCropAdvisory.fertilizer.reason)}
            isDone={completedActions.fertilizer}
            selectedLanguage={chatLanguage}
          />
        </motion.div>
      </div>
      )}

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-[350px] rounded-xl border bg-background shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
            >
              {/* Chat Header */}
              <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold text-sm">Kisan Sahayak</h3>
                    <div className="flex items-center gap-1 text-xs opacity-80">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Online
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Select value={chatLanguage} onValueChange={setChatLanguage}>
                    <SelectTrigger className="h-7 w-[100px] bg-primary-foreground/10 border-transparent text-xs text-primary-foreground focus:ring-0">
                      <Languages className="mr-1 h-3 w-3" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Punjabi">Punjabi</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsChatOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 h-[300px] overflow-y-auto bg-muted/30">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`rounded-lg px-3 py-2 max-w-[85%] text-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted border'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-lg px-3 py-2 bg-muted border flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Suggestions & Input */}
              <div className="p-4 border-t bg-background space-y-3">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {suggestions.map((s) => (
                    <Button 
                      key={s} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs whitespace-nowrap h-7 px-2"
                      onClick={() => handleSendMessage(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex gap-2"
                >
                  <Input 
                    placeholder="Ask about your crop..." 
                    className="h-9 text-sm"
                    value={inputMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-xl p-0 hover:scale-110 transition-transform"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          {isChatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  )
}
