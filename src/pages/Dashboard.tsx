import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Volume2,
  Check,
  ArrowRight,
  ExternalLink,
  Target,
  Users,
  BookmarkPlus,
  TrendingUp as TrendIcon,
  Bell
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { CircularProgress } from "../components/ui/circular-progress"
import { mockFarmer, mockWeatherAlerts, mockCropAdvisory } from "../data/mockData"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"
import { getForecastByCity } from "../services/weatherService"
import { getLatestPrice, getPriceTrend } from "../services/mandiService"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

export function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // State from User's Logic
  const profitScore = 78
  const profitTrend = 6
  const [priceTrend, setPriceTrend] = useState<"up" | "down" | "stable">("up")
  const [currentPrice, setCurrentPrice] = useState(2450)
  const [priceChange, setPriceChange] = useState(6)
  const [weatherRisk, setWeatherRisk] = useState<"low" | "medium" | "high">("medium")
  const [advisoryDone, setAdvisoryDone] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // State from Strict Auth/Data Logic
  const [farmerData, setFarmerData] = useState<any>({ name: "Loading...", location: "Loading...", currentCrop: "Loading...", farmSize: "..." })
  const [, setLoading] = useState(true)

  // 1. Fetch Farmer Data & Handle Auth (Demo Logic)
  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        // DEMO: Check localStorage instead of Supabase Auth
        const farmerId = localStorage.getItem("farmer_id")

        if (!farmerId) {
          navigate("/auth")
          return
        }

        const { data: farmer, error } = await supabase
          .from('farmers')
          .select('*')
          .eq('id', farmerId)
          .single()

        if (error) {
          console.error("Dashboard fetch error:", error)
          // If error (e.g. invalid ID), redirect to auth
          localStorage.removeItem("farmer_id")
          navigate("/auth")
          return
        }

        if (farmer) {
          setFarmerData({
            name: farmer.name,
            location: `${farmer.city}, ${farmer.state}`,
            currentCrop: "Wheat", // Hardcoded for demo if not in DB
            farmSize: "5" // Hardcoded for demo if not in DB
          })
        }
      } catch (error) {
        console.error("Error fetching farmer data:", error)
        setFarmerData({
          name: "Farmer",
          location: "Error Loading Data",
          currentCrop: "--",
          farmSize: "--"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFarmerData()
  }, [navigate])

  // 2. Fetch Weather & Mandi Prices (User's Features)
  useEffect(() => {
    const loadWeatherRisk = async () => {
      try {
        const forecast = await getForecastByCity("Bhopal")
        const highRiskDays = forecast.filter(day => day.riskLevel === "high").length
        const mediumRiskDays = forecast.filter(day => day.riskLevel === "medium").length

        if (highRiskDays > 0) {
          setWeatherRisk("high")
        } else if (mediumRiskDays > 2) {
          setWeatherRisk("medium")
        } else {
          setWeatherRisk("low")
        }
      } catch (error) {
        console.error("Error loading weather risk:", error)
        setWeatherRisk("medium")
      }
    }

    const loadMandiPrices = async () => {
      try {
        const price = await getLatestPrice(mockFarmer.currentCrop)
        if (price) {
          setCurrentPrice(price)
        }

        const trend = await getPriceTrend(mockFarmer.currentCrop, 7)
        if (trend.length >= 2) {
          const oldPrice = trend[0].price
          const newPrice = trend[trend.length - 1].price
          const change = ((newPrice - oldPrice) / oldPrice * 100).toFixed(1)
          setPriceChange(parseFloat(change))

          if (parseFloat(change) > 2) {
            setPriceTrend("up")
          } else if (parseFloat(change) < -2) {
            setPriceTrend("down")
          } else {
            setPriceTrend("stable")
          }
        }
      } catch (error) {
        console.error("Error loading mandi prices:", error)
      }
    }

    loadWeatherRisk()
    loadMandiPrices()
  }, [])

  // Voice synthesis
  const speakDashboardSummary = () => {
    if (!('speechSynthesis' in window)) {
      alert('Voice feature not supported in this browser')
      return
    }

    window.speechSynthesis.cancel()

    const weatherImpact = weatherRisk === "high"
      ? "High risk to wheat in next 7 days due to heavy rainfall"
      : weatherRisk === "medium"
        ? "Medium risk with moderate weather conditions expected"
        : "Low risk to wheat in next 7 days, clear weather ahead"

    const priceAction = priceTrend === "up"
      ? "Wheat prices are rising. Suggested action: Hold crop for better prices"
      : "Wheat prices are stable"

    const profitInterpretation = profitScore >= 75
      ? `Good profit potential at ${profitScore} percent if current advisory is followed. Score has increased by ${profitTrend} percent since last week`
      : profitScore >= 50
        ? `Moderate profit potential at ${profitScore} percent. Following advisory recommendations can improve this`
        : `Low profit potential at ${profitScore} percent. Immediate action required`

    const summary = `Dashboard summary for ${farmerData.name}. 
      Weather: ${weatherImpact}. 
      Price trend: ${priceAction}. 
      Latest advisory: ${mockCropAdvisory.fertilizer.advice}. 
      Profit Score: ${profitInterpretation}.`

    const utterance = new SpeechSynthesisUtterance(summary)
    utterance.lang = "en-IN"
    utterance.rate = 0.9

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const speakAdvisory = () => {
    if (!('speechSynthesis' in window)) {
      alert('Voice feature not supported in this browser')
      return
    }
    window.speechSynthesis.cancel()
    const text = `Latest Advisory for Fertilizer Application. ${mockCropAdvisory.fertilizer.advice}. Explanation: ${mockCropAdvisory.fertilizer.reason}`
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-IN"
    utterance.rate = 0.9
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const getTodayTopAction = () => {
    const highPriorityAlert = mockWeatherAlerts.find(a => a.type === "high")
    if (highPriorityAlert) {
      return {
        icon: "⚠️",
        text: highPriorityAlert.suggestedAction,
        type: "urgent" as const
      }
    }
    if (!advisoryDone) {
      return {
        icon: "🔔",
        text: `Apply 50kg Urea per acre (Tillering stage)`,
        type: "advisory" as const
      }
    }
    return {
      icon: "✅",
      text: "All priority tasks completed. Check marketplace for selling opportunities",
      type: "success" as const
    }
  }

  const topAction = getTodayTopAction()

  const sortedAlerts = [...mockWeatherAlerts].sort((a, b) => {
    const priority = { high: 3, medium: 2, low: 1 }
    return priority[b.type] - priority[a.type]
  })

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl md:text-3xl">
              {t('dashboard.welcome')}, {farmerData.name}! 👋
            </CardTitle>
            <CardDescription className="text-base">
              {farmerData.location} • Currently growing {farmerData.currentCrop} on {farmerData.farmSize} acres
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Today's Top Action Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <Card className={`border-2 ${topAction.type === 'urgent' ? 'bg-red-50 border-red-300' :
          topAction.type === 'advisory' ? 'bg-amber-50 border-amber-300' :
            'bg-green-50 border-green-300'
          }`}>
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{topAction.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Today's Priority
                  </p>
                  <p className="font-semibold text-base">
                    {topAction.text}
                  </p>
                </div>
              </div>
              <Link to="/dashboard/crop-advisory">
                <Button size="sm" variant={topAction.type === 'urgent' ? 'default' : 'outline'}>
                  Take Action <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Today's Intelligence</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={speakDashboardSummary}
            disabled={isSpeaking}
            className="gap-2"
          >
            <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
            {isSpeaking ? 'Speaking...' : 'Explain my dashboard'}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Weather Risk */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Weather Risk</CardTitle>
              <Badge
                variant={
                  weatherRisk === "high" ? "danger" : weatherRisk === "medium" ? "warning" : "success"
                }
              >
                {weatherRisk.toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {weatherRisk === "high" ? (
                  <AlertCircle className="h-8 w-8 text-red-500" />
                ) : weatherRisk === "medium" ? (
                  <Clock className="h-8 w-8 text-yellow-500" />
                ) : (
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Next 7 days</p>
                  <p className="font-semibold">
                    {weatherRisk === "high"
                      ? "High rainfall expected"
                      : weatherRisk === "medium"
                        ? "Moderate conditions"
                        : "Clear weather ahead"}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Impact:</span>{" "}
                  {weatherRisk === "high"
                    ? "High risk to wheat - take precautions"
                    : weatherRisk === "medium"
                      ? "Medium risk to wheat - monitor closely"
                      : "Low risk to wheat in next 7 days"}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Source: IMD weather data</span>
                <Link to="/dashboard/weather-alerts" className="text-primary hover:underline flex items-center gap-1">
                  View forecast <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Price Trend */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Price Trend</CardTitle>
              <Badge variant="success">
                {priceTrend === "up" ? "RISING" : "STABLE"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {priceTrend === "up" ? (
                  <TrendingUp className="h-8 w-8 text-green-500" />
                ) : priceTrend === "down" ? (
                  <TrendingDown className="h-8 w-8 text-red-500" />
                ) : (
                  <TrendingUp className="h-8 w-8 text-gray-500" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">{mockFarmer.currentCrop} prices</p>
                  <p className="font-semibold">₹{currentPrice.toLocaleString()}/quintal</p>
                  <p className={`text-sm ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}% this week
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Suggested action:</span>{" "}
                  {priceTrend === "up"
                    ? "Hold crop (prices rising)"
                    : "Consider selling at current prices"}
                </p>
                <p className="text-xs text-primary mt-1">
                  💡 Best sell window: 10-15 days
                </p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Source: Govt. mandi data</span>
                <Link to="/dashboard/mandi-prices" className="text-primary hover:underline flex items-center gap-1">
                  See predictions <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Advisory Summary */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Latest Advisory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm font-medium">Fertilizer Application</p>
                <p className="text-xs text-muted-foreground">
                  Apply 50kg Urea per acre. Nitrogen is critical at tillering stage.
                </p>
                <Badge variant="default" className="mt-2">87% Confidence</Badge>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant={advisoryDone ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAdvisoryDone(!advisoryDone)}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-1" />
                  {advisoryDone ? "Done" : "Mark Done"}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={speakAdvisory}
                        disabled={isSpeaking}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Explain this advisory</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="text-xs text-muted-foreground">
                Based on IMD weather & crop data
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Profit Score & Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profit Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Profit Score</CardTitle>
              <CardDescription>
                Your current profit potential based on crop condition, market prices, and weather
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CircularProgress value={profitScore} label="Profit" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      This score combines crop health, market prices, weather conditions, and best practices.
                      Higher scores indicate better profit potential.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="mt-6 text-center space-y-2 w-full">
                <p className="text-sm font-medium text-foreground">
                  {profitScore >= 75
                    ? "Good profit potential if current advisory is followed"
                    : profitScore >= 50
                      ? "Moderate profit potential - follow recommendations"
                      : "Low profit potential - immediate action needed"}
                </p>

                <div className="flex items-center justify-center gap-2 text-sm">
                  <div className={`flex items-center gap-1 ${profitTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {profitTrend >= 0 ? (
                      <TrendIcon className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-semibold">
                      {profitTrend >= 0 ? '+' : ''}{profitTrend}% since last week
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Based on real-time data and AI predictions
                </p>
              </div>

              <Link to="/dashboard/simulator" className="mt-4 w-full">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Target className="h-4 w-4" />
                  Try What-If Simulator
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts Timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Recent Alerts</CardTitle>
              <CardDescription>Actionable suggestions for your farm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedAlerts.slice(0, 3).map((alert, index) => (
                  <div
                    key={alert.id}
                    className={`flex gap-3 pb-4 ${index < 2 ? "border-b" : ""
                      }`}
                  >
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <div
                        className={`h-3 w-3 rounded-full ${alert.type === "high"
                          ? "bg-red-500 animate-pulse"
                          : alert.type === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          }`}
                      />
                      {alert.type === "high" && (
                        <Bell className="h-3 w-3 text-red-500 animate-bounce" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{alert.title}</p>
                            <Badge
                              variant={
                                alert.type === "high"
                                  ? "danger"
                                  : alert.type === "medium"
                                    ? "warning"
                                    : "success"
                              }
                              className="text-xs"
                            >
                              {alert.type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary">
                          💡 {alert.suggestedAction}
                        </p>
                      </div>

                      <div className="flex gap-3 text-xs">
                        <Link
                          to="/dashboard/crop-advisory"
                          className="text-primary hover:underline font-medium flex items-center gap-1"
                        >
                          Take action <ArrowRight className="h-3 w-3" />
                        </Link>
                        <Link
                          to="/dashboard/farm-log"
                          className="text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1"
                        >
                          <BookmarkPlus className="h-3 w-3" />
                          Add to Farm Log
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Community Connection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link to="/dashboard/community">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="py-4 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-semibold">Join the Farmer Community</p>
                    <p className="text-sm text-muted-foreground">
                      See how other farmers are managing their crops in similar conditions
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </div>
  )
}
