const OPENWEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'ce96122f0b926daa53d814f795b207d0'
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

export interface WeatherData {
  temp: number
  feelsLike: number
  tempMin: number
  tempMax: number
  humidity: number
  pressure: number
  condition: string
  description: string
  icon: string
  windSpeed: number
  rainfall: number
}

export interface ForecastData {
  date: string
  temperature: { min: number; max: number }
  condition: string
  rainfall: number
  riskLevel: "low" | "medium" | "high"
  humidity: number
  windSpeed: number
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    )
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      rainfall: data.rain?.['1h'] || 0
    }
  } catch (error) {
    console.error('Error fetching current weather:', error)
    throw error
  }
}

export async function getWeatherForecast(lat: number, lon: number): Promise<ForecastData[]> {
  try {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    )
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Group forecasts by day and get daily summary
    const dailyForecasts = new Map<string, any[]>()
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0]
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, [])
      }
      dailyForecasts.get(date)!.push(item)
    })
    
    // Process daily data
    const forecast: ForecastData[] = []
    let dayCount = 0
    
    for (const [date, dayData] of dailyForecasts) {
      if (dayCount >= 7) break
      
      const temps = dayData.map(d => d.main.temp)
      const rainfall = dayData.reduce((sum, d) => sum + (d.rain?.['3h'] || 0), 0)
      const avgHumidity = dayData.reduce((sum, d) => sum + d.main.humidity, 0) / dayData.length
      const avgWindSpeed = dayData.reduce((sum, d) => sum + d.wind.speed, 0) / dayData.length
      const mainCondition = dayData[Math.floor(dayData.length / 2)].weather[0].main
      
      // Calculate risk level based on weather conditions
      let riskLevel: "low" | "medium" | "high" = "low"
      if (rainfall > 50 || avgWindSpeed > 15) {
        riskLevel = "high"
      } else if (rainfall > 20 || avgWindSpeed > 10 || avgHumidity > 85) {
        riskLevel = "medium"
      }
      
      forecast.push({
        date,
        temperature: {
          min: Math.round(Math.min(...temps)),
          max: Math.round(Math.max(...temps))
        },
        condition: mainCondition,
        rainfall: Math.round(rainfall),
        riskLevel,
        humidity: Math.round(avgHumidity),
        windSpeed: Math.round(avgWindSpeed * 10) / 10
      })
      
      dayCount++
    }
    
    return forecast
  } catch (error) {
    console.error('Error fetching weather forecast:', error)
    throw error
  }
}

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    )
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      rainfall: data.rain?.['1h'] || 0
    }
  } catch (error) {
    console.error('Error fetching weather by city:', error)
    throw error
  }
}

export async function getForecastByCity(city: string): Promise<ForecastData[]> {
  try {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    )
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Group forecasts by day and get daily summary
    const dailyForecasts = new Map<string, any[]>()
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0]
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, [])
      }
      dailyForecasts.get(date)!.push(item)
    })
    
    // Process daily data
    const forecast: ForecastData[] = []
    let dayCount = 0
    
    for (const [date, dayData] of dailyForecasts) {
      if (dayCount >= 7) break
      
      const temps = dayData.map(d => d.main.temp)
      const rainfall = dayData.reduce((sum, d) => sum + (d.rain?.['3h'] || 0), 0)
      const avgHumidity = dayData.reduce((sum, d) => sum + d.main.humidity, 0) / dayData.length
      const avgWindSpeed = dayData.reduce((sum, d) => sum + d.wind.speed, 0) / dayData.length
      const mainCondition = dayData[Math.floor(dayData.length / 2)].weather[0].main
      
      // Calculate risk level based on weather conditions
      let riskLevel: "low" | "medium" | "high" = "low"
      if (rainfall > 50 || avgWindSpeed > 15) {
        riskLevel = "high"
      } else if (rainfall > 20 || avgWindSpeed > 10 || avgHumidity > 85) {
        riskLevel = "medium"
      }
      
      forecast.push({
        date,
        temperature: {
          min: Math.round(Math.min(...temps)),
          max: Math.round(Math.max(...temps))
        },
        condition: mainCondition,
        rainfall: Math.round(rainfall),
        riskLevel,
        humidity: Math.round(avgHumidity),
        windSpeed: Math.round(avgWindSpeed * 10) / 10
      })
      
      dayCount++
    }
    
    return forecast
  } catch (error) {
    console.error('Error fetching weather forecast by city:', error)
    throw error
  }
}
