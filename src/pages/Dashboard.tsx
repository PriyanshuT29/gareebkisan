import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { CircularProgress } from "../components/ui/circular-progress"
import { mockFarmer, mockWeatherAlerts } from "../data/mockData"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"
import { getForecastByCity } from "../services/weatherService"
import { useTranslation } from "react-i18next"

export function Dashboard() {
  const { t } = useTranslation()
  const profitScore = 78
  const priceTrend = "up" as "up" | "down" | "stable"
  const [weatherRisk, setWeatherRisk] = useState<"low" | "medium" | "high">("medium")
  
  useEffect(() => {
    // Load weather data and determine risk
    const loadWeatherRisk = async () => {
      try {
        const forecast = await getForecastByCity("Bhopal,IN")
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
      }
    }
    
    loadWeatherRisk()
  }, [])

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl">
              {t('dashboard.welcome')}, {mockFarmer.name}! 👋
            </CardTitle>
            <CardDescription className="text-base">
              {mockFarmer.location} • Currently growing {mockFarmer.currentCrop} on {mockFarmer.farmSize} acres
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Today's Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="mb-4 text-2xl font-bold">Today's Intelligence</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Weather Risk */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Weather Risk</CardTitle>
              <Badge
                variant={
                  weatherRisk === "high" ? "danger" : weatherRisk === "medium" ? "warning" : "success"
                }
              >
                {weatherRisk.toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Price Trend */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Price Trend</CardTitle>
              <Badge variant="success">
                {priceTrend === "up" ? "RISING" : "STABLE"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {priceTrend === "up" ? (
                  <TrendingUp className="h-8 w-8 text-green-500" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-500" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">{mockFarmer.currentCrop} prices</p>
                  <p className="font-semibold">₹2,450/quintal</p>
                  <p className="text-sm text-green-600">+6% this week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advisory Summary */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Latest Advisory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Fertilizer Application</p>
                <p className="text-xs text-muted-foreground">
                  Apply 50kg Urea per acre. Nitrogen is critical at tillering stage.
                </p>
                <Badge variant="default" className="mt-2">87% Confidence</Badge>
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
              <CardTitle>Profit Score</CardTitle>
              <CardDescription>
                Your current profit potential based on crop condition, market prices, and weather
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
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
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Based on real-time data and AI predictions
              </p>
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
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Actionable suggestions for your farm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockWeatherAlerts.slice(0, 3).map((alert, index) => (
                  <div
                    key={alert.id}
                    className={`flex gap-4 pb-4 ${
                      index < mockWeatherAlerts.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full mt-2 ${
                        alert.type === "high"
                          ? "bg-red-500"
                          : alert.type === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{alert.title}</p>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                        </div>
                        <Badge
                          variant={
                            alert.type === "high"
                              ? "danger"
                              : alert.type === "medium"
                              ? "warning"
                              : "success"
                          }
                        >
                          {alert.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm font-medium text-primary">
                        💡 {alert.suggestedAction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
