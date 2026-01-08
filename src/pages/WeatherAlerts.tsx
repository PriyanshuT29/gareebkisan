import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CloudRain, Sun, Cloud, AlertTriangle, Shield, Bell, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Switch } from "../components/ui/switch"
import { mockWeatherAlerts } from "../data/mockData"
import { getForecastByCity, type ForecastData } from "../services/weatherService"
import { useTranslation } from "react-i18next"

const getWeatherIcon = (condition: string) => {
  if (condition.toLowerCase().includes("rain")) return CloudRain
  if (condition.toLowerCase().includes("cloud")) return Cloud
  return Sun
}

const getRiskColor = (risk: "low" | "medium" | "high") => {
  switch (risk) {
    case "high":
      return "bg-red-500"
    case "medium":
      return "bg-yellow-500"
    default:
      return "bg-green-500"
  }
}

export function WeatherAlerts() {
  const { t } = useTranslation()
  const [pushAlerts, setPushAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [forecast, setForecast] = useState<ForecastData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [city, setCity] = useState("Bhopal,IN") // Default location
  
  useEffect(() => {
    loadWeatherForecast()
  }, [city])
  
  const loadWeatherForecast = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getForecastByCity(city)
      setForecast(data)
    } catch (err) {
      setError("Failed to load weather data. Using default location.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  const hasHighRisk = forecast.some((day) => day.riskLevel === "high")

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2 text-3xl font-bold">{t('weather.title')}</h1>
        <p className="text-muted-foreground">
          Real-time weather forecasts with crop-specific risk assessments
        </p>
      </motion.div>

      {/* Crisis Mode Banner */}
      {hasHighRisk && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-red-500 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 mb-2">High Risk Weather Alert</h3>
                  <p className="text-red-800 mb-3">
                    Heavy rainfall expected in the next 48 hours. Take immediate action to protect your crops.
                  </p>
                  <Badge variant="danger" className="text-sm">
                    URGENT ACTION REQUIRED
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Weather Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t('weather.week')}</CardTitle>
            <CardDescription>Weather conditions and risk levels for {city.split(',')[0]}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>{error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {forecast.map((day, index) => {
                const Icon = getWeatherIcon(day.condition)
                return (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${getRiskColor(day.riskLevel)}/10`}>
                        <Icon className={`h-6 w-6 ${getRiskColor(day.riskLevel)}`} />
                      </div>
                      <div>
                        <p className="font-semibold">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        <p className="text-sm text-muted-foreground">{day.condition}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold">{day.temperature.max}°C / {day.temperature.min}°C</p>
                        {day.rainfall > 0 && (
                          <p className="text-sm text-blue-600">{day.rainfall}mm rain</p>
                        )}
                      </div>
                      <Badge
                        variant={
                          day.riskLevel === "high" ? "danger" : day.riskLevel === "medium" ? "warning" : "success"
                        }
                      >
                        {day.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </motion.div>
                )
              })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Explanation Panel */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Crop-Specific Risk Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockWeatherAlerts.map((alert) => (
                <div key={alert.id} className="p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{alert.title}</h4>
                    <Badge
                      variant={
                        alert.type === "high" ? "danger" : alert.type === "medium" ? "warning" : "success"
                      }
                    >
                      {alert.type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Crop Impact:</p>
                      <p className="text-sm">{alert.cropImpact}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary">Suggested Action:</p>
                      <p className="text-sm font-medium">{alert.suggestedAction}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Alert Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert Preferences
              </CardTitle>
              <CardDescription>Choose how you want to receive weather alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get instant alerts on your device
                  </p>
                </div>
                <Switch checked={pushAlerts} onCheckedChange={setPushAlerts} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts via text message
                  </p>
                </div>
                <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
              </div>
              <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Alerts are sent only for medium and high-risk weather conditions to avoid notification fatigue.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
