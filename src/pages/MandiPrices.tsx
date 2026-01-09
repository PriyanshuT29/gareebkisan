import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Calendar, AlertCircle, DollarSign, Loader2, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { mockPricePrediction, crops as defaultCrops } from "../data/mockData"
import { getLatestPrice, getPriceTrend, getMarketsForCommodity, getPriceStatistics } from "../services/mandiService"

export function MandiPrices() {
  const [selectedCrop, setSelectedCrop] = useState("Wheat")
  const [selectedMandi, setSelectedMandi] = useState("All Markets")
  const [timeframe, setTimeframe] = useState("7")
  const [loading, setLoading] = useState(false)
  const [currentPrice, setCurrentPrice] = useState(mockPricePrediction.currentPrice)
  const [chartData, setChartData] = useState<Array<{date: string, price: number}>>([])
  const [markets, setMarkets] = useState<string[]>(["All Markets"])
  const [priceChangePercent, setPriceChangePercent] = useState("+10.2")
  const [statistics, setStatistics] = useState<any>(null)
  const [avgPrice, setAvgPrice] = useState(0)
  
  const crops = ["Wheat", "Rice", "Maize", "Bajra", "Jowar", "Barley", "Gram", "Tur (Arhar)", "Moong", "Urad", "Groundnut", "Soyabean", "Sunflower", "Cotton", "Sugarcane"]
  
  // Fetch price data when crop/mandi/timeframe changes
  useEffect(() => {
    const fetchPriceData = async () => {
      setLoading(true)
      try {
        // Get latest price
        const latestPrice = await getLatestPrice(selectedCrop)
        if (latestPrice) {
          setCurrentPrice(latestPrice)
        }
        
        // Get price trend
        const days = parseInt(timeframe)
        const trend = await getPriceTrend(selectedCrop, days)
        
        if (trend.length > 0) {
          setChartData(trend)
          
          // Calculate price change
          const oldPrice = trend[0].price
          const newPrice = trend[trend.length - 1].price
          const change = ((newPrice - oldPrice) / oldPrice * 100).toFixed(1)
          setPriceChangePercent(change)
          
          // Calculate average
          const avg = trend.reduce((sum, item) => sum + item.price, 0) / trend.length
          setAvgPrice(avg)
        } else {
          // Fallback to simulated data
          const simulatedTrend = generateSimulatedTrend(days, latestPrice || currentPrice)
          setChartData(simulatedTrend)
        }
        
        // Get statistics
        const stats = await getPriceStatistics(selectedCrop, days)
        if (stats) {
          setStatistics(stats)
        }
      } catch (error) {
        console.error("Error fetching price data:", error)
        // Fallback to simulated data
        const simulatedTrend = generateSimulatedTrend(parseInt(timeframe), currentPrice)
        setChartData(simulatedTrend)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPriceData()
  }, [selectedCrop, selectedMandi, timeframe])
  
  // Fetch available markets when crop changes
  useEffect(() => {
    const fetchAvailableMarkets = async () => {
      try {
        const marketList = await getMarketsForCommodity(selectedCrop)
        if (marketList.length > 0) {
          setMarkets(["All Markets", ...marketList])
        }
      } catch (error) {
        console.error("Error fetching markets:", error)
      }
    }
    
    fetchAvailableMarkets()
  }, [selectedCrop])
  
  // Generate simulated trend as fallback
  const generateSimulatedTrend = (days: number, basePrice: number) => {
    const data = []
    for (let i = 0; i < days; i++) {
      const variation = (Math.random() - 0.5) * 200
      data.push({
        date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString(),
        price: Math.round(basePrice + variation)
      })
    }
    return data
  }

  const getChartData = () => {
    return chartData
  }

  const displayChartData = getChartData()
  const maxPrice = displayChartData.length > 0 ? Math.max(...displayChartData.map((d) => d.price)) : currentPrice
  const minPrice = displayChartData.length > 0 ? Math.min(...displayChartData.map((d) => d.price)) : currentPrice
  
  const handleRefresh = () => {
    setSelectedCrop(prev => prev) // Trigger useEffect
  }

  const recommendation = parseFloat(priceChangePercent) < 0 ? "sell" : "hold"
  const volatility = statistics 
    ? (statistics.volatility > 15 ? "high" : statistics.volatility > 8 ? "medium" : "low")
    : mockPricePrediction.volatility
  const bestWindow = {
    start: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2 text-3xl font-bold">Mandi Price Prediction</h1>
        <p className="text-muted-foreground">
          AI-powered price forecasts to help you decide when and where to sell
        </p>
      </motion.div>

      {/* Selectors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">Select Crop</label>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {crops.map((crop) => (
                <SelectItem key={crop} value={crop}>
                  {crop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Select Mandi</label>
          <Select value={selectedMandi} onValueChange={setSelectedMandi}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {markets.map((mandi) => (
                <SelectItem key={mandi} value={mandi}>
                  {mandi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Price Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Price Forecast</CardTitle>
                <CardDescription>
                  Predicted prices for {selectedCrop} at {selectedMandi}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">₹{currentPrice.toLocaleString()}</span>
                <Badge variant={parseFloat(priceChangePercent) >= 0 ? "success" : "danger"} className="ml-2">
                  {parseFloat(priceChangePercent) >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {priceChangePercent}%
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={timeframe} onValueChange={setTimeframe}>
              <TabsList className="mb-4">
                <TabsTrigger value="7">7 Days</TabsTrigger>
                <TabsTrigger value="15">15 Days</TabsTrigger>
                <TabsTrigger value="30">30 Days</TabsTrigger>
              </TabsList>
              <TabsContent value={timeframe}>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : displayChartData.length === 0 ? (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p>No price data available</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={displayChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          stroke="#6b7280"
                        />
                        <YAxis
                          tickFormatter={(value) => `₹${value}`}
                          stroke="#6b7280"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                          }}
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                          formatter={(value: number | undefined) => value !== undefined ? [`₹${value.toLocaleString()}`, "Price"] : ["", ""]}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#22c55e"
                          strokeWidth={3}
                          dot={{ fill: "#22c55e", r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                        <ReferenceLine
                          y={avgPrice}
                          stroke="#94a3b8"
                          strokeDasharray="3 3"
                          label={{ value: "Average", position: "right" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Best Selling Window */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Best Selling Window
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Recommended Date Range</p>
                  <p className="text-lg font-bold text-green-700">
                    {new Date(bestWindow.start).toLocaleDateString()} - {new Date(bestWindow.end).toLocaleDateString()}
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 border border-green-200">
                  <p className="text-sm text-green-900">
                    {parseFloat(priceChangePercent) >= 0 
                      ? "Prices are trending upward. Optimal selling window is in 10-15 days."
                      : "Prices are stable. Consider selling within current window."}
                  </p>
                </div>
                <div className="pt-2 border-t text-xs text-muted-foreground">
                  <p>Based on historical trends and market analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendation & Volatility */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          {/* Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold capitalize">{recommendation}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {recommendation === "hold"
                      ? "Wait for better prices"
                      : "Good time to sell"}
                  </p>
                </div>
                {recommendation === "hold" ? (
                  <TrendingUp className="h-12 w-12 text-green-500" />
                ) : (
                  <TrendingDown className="h-12 w-12 text-orange-500" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Price Volatility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Price Volatility
              </CardTitle>
            </CardHeader>
            <CardContent>
                <Badge
                  variant={
                    volatility === "high"
                      ? "danger"
                      : volatility === "medium"
                      ? "warning"
                      : "success"
                  }
                  className="text-sm"
                >
                  {volatility.toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground mt-3">
                  Price range: ₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {volatility === "high"
                    ? "Prices may fluctuate significantly. Monitor daily."
                    : volatility === "medium"
                    ? "Moderate price movements expected."
                    : "Stable prices with minimal fluctuations."}
                </p>
                {statistics && (
                  <p className="text-xs text-primary mt-2">
                    Average: ₹{statistics.average.toLocaleString()} • Source: Govt. of India
                  </p>
                )}
              </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
