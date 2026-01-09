const MANDI_API_KEY = '579b464db66ec23bdd00000103b61ae65770414643985f03e5f9bbeb'
const MANDI_API_BASE_URL = 'https://api.data.gov.in/resource'

export interface MandiPriceData {
  state: string
  district: string
  market: string
  commodity: string
  variety: string
  arrival_date: string
  min_price: string
  max_price: string
  modal_price: string
}

export interface MandiPriceResponse {
  records: MandiPriceData[]
  total: number
  count: number
}

/**
 * Fetch mandi prices from Government of India API
 * Resource ID: 9ef84268-d588-465a-a308-a864a43d0070 (Agricultural Marketing - Price Data)
 */
export async function getMandiPrices(
  commodity?: string,
  state?: string,
  limit: number = 10
): Promise<MandiPriceResponse> {
  try {
    const params = new URLSearchParams({
      'api-key': MANDI_API_KEY,
      format: 'json',
      limit: limit.toString(),
    })

    if (commodity) {
      params.append('filters[commodity]', commodity)
    }

    if (state) {
      params.append('filters[state]', state)
    }

    // Using the Agricultural Marketing resource ID
    const resourceId = '9ef84268-d588-465a-a308-a864a43d0070'
    const url = `${MANDI_API_BASE_URL}/${resourceId}?${params.toString()}`

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Mandi API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      records: data.records || [],
      total: data.total || 0,
      count: data.count || 0
    }
  } catch (error) {
    console.error('Error fetching mandi prices:', error)
    throw error
  }
}

/**
 * Get latest price for a specific commodity and market
 */
export async function getLatestPrice(
  commodity: string,
  market?: string
): Promise<number | null> {
  try {
    const data = await getMandiPrices(commodity, undefined, 100)
    
    if (!data.records || data.records.length === 0) {
      return null
    }

    // Filter by market if specified
    let filteredRecords = data.records
    if (market) {
      filteredRecords = data.records.filter(r => 
        r.market.toLowerCase().includes(market.toLowerCase())
      )
    }

    if (filteredRecords.length === 0) {
      return null
    }

    // Sort by date to get latest
    const sorted = filteredRecords.sort((a, b) => 
      new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime()
    )

    // Return modal price (most common price)
    const latestPrice = parseFloat(sorted[0].modal_price)
    return isNaN(latestPrice) ? null : latestPrice
  } catch (error) {
    console.error('Error getting latest price:', error)
    return null
  }
}

/**
 * Get price trend for a commodity over time
 */
export async function getPriceTrend(
  commodity: string,
  days: number = 30
): Promise<{ date: string; price: number }[]> {
  try {
    const data = await getMandiPrices(commodity, undefined, 100)
    
    if (!data.records || data.records.length === 0) {
      return []
    }

    // Group by date and calculate average modal price
    const priceMap = new Map<string, number[]>()
    
    data.records.forEach(record => {
      const date = record.arrival_date
      const price = parseFloat(record.modal_price)
      
      if (!isNaN(price)) {
        if (!priceMap.has(date)) {
          priceMap.set(date, [])
        }
        priceMap.get(date)!.push(price)
      }
    })

    // Calculate average for each date
    const trend = Array.from(priceMap.entries()).map(([date, prices]) => ({
      date,
      price: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    }))

    // Sort by date and limit to specified days
    return trend
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-days)
  } catch (error) {
    console.error('Error getting price trend:', error)
    return []
  }
}

/**
 * Get available markets for a commodity
 */
export async function getMarketsForCommodity(commodity: string): Promise<string[]> {
  try {
    const data = await getMandiPrices(commodity, undefined, 100)
    
    if (!data.records || data.records.length === 0) {
      return []
    }

    // Get unique markets
    const markets = [...new Set(data.records.map(r => r.market))]
    return markets.sort()
  } catch (error) {
    console.error('Error getting markets:', error)
    return []
  }
}

/**
 * Calculate price statistics for a commodity
 */
export async function getPriceStatistics(
  commodity: string,
  market?: string
): Promise<{
  current: number
  min: number
  max: number
  average: number
  volatility: 'low' | 'medium' | 'high'
} | null> {
  try {
    const data = await getMandiPrices(commodity, undefined, 100)
    
    if (!data.records || data.records.length === 0) {
      return null
    }

    let filteredRecords = data.records
    if (market) {
      filteredRecords = data.records.filter(r => 
        r.market.toLowerCase().includes(market.toLowerCase())
      )
    }

    if (filteredRecords.length === 0) {
      return null
    }

    const prices = filteredRecords
      .map(r => parseFloat(r.modal_price))
      .filter(p => !isNaN(p))

    if (prices.length === 0) {
      return null
    }

    const current = prices[0]
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const average = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)

    // Calculate volatility based on price range
    const range = max - min
    const volatilityPercent = (range / average) * 100

    const volatility = volatilityPercent > 15 ? 'high' : volatilityPercent > 7 ? 'medium' : 'low'

    return {
      current: Math.round(current),
      min: Math.round(min),
      max: Math.round(max),
      average,
      volatility
    }
  } catch (error) {
    console.error('Error calculating price statistics:', error)
    return null
  }
}
