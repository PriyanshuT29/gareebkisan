import { supabase } from '../lib/supabase'

const MANDI_API_KEY = import.meta.env.VITE_MANDI_API_KEY || '579b464db66ec23bdd00000103b61ae65770414643985f03e5f9bbeb'
const MANDI_API_BASE_URL = 'https://api.data.gov.in/resource'
const CACHE_DURATION_HOURS = 12

export interface MandiPriceData {
  state: string
  district: string
  market: string
  commodity: string
  variety: string
  grade: string
  arrival_date: string
  min_price: number
  max_price: number
  modal_price: number
}

export interface MandiPriceResponse {
  records: MandiPriceData[]
  total: number
  count: number
}

export interface SupabaseMandiPrice {
  id?: string
  crop_name: string
  mandi_name: string
  state: string
  district?: string
  variety?: string
  grade?: string
  price_per_quintal: number
  min_price?: number
  max_price?: number
  modal_price?: number
  recorded_date: string
  created_at?: string
  updated_at?: string
}

/**
 * Parse date from DD/MM/YYYY format to YYYY-MM-DD
 */
function parseMandiDate(dateStr: string): string {
  try {
    const [day, month, year] = dateStr.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

/**
 * Check if cached data is fresh (less than 12 hours old)
 */
function isCacheFresh(createdAt: string): boolean {
  const cacheTime = new Date(createdAt).getTime()
  const now = new Date().getTime()
  const hoursDiff = (now - cacheTime) / (1000 * 60 * 60)
  return hoursDiff < CACHE_DURATION_HOURS
}

/**
 * Transform API data to Supabase format
 */
function transformToSupabaseFormat(apiData: MandiPriceData): SupabaseMandiPrice {
  return {
    crop_name: apiData.commodity,
    mandi_name: apiData.market,
    state: apiData.state,
    district: apiData.district,
    variety: apiData.variety,
    grade: apiData.grade,
    price_per_quintal: apiData.modal_price, // Modal price is the primary price
    min_price: apiData.min_price,
    max_price: apiData.max_price,
    modal_price: apiData.modal_price,
    recorded_date: parseMandiDate(apiData.arrival_date)
  }
}

/**
 * Fetch mandi prices from Supabase cache
 */
async function getMandiPricesFromCache(
  commodity?: string,
  state?: string,
  limit: number = 100
): Promise<{ data: SupabaseMandiPrice[], isFresh: boolean }> {
  try {
    let query = supabase
      .from('mandi_prices')
      .select('*')
      .order('recorded_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (commodity) {
      query = query.ilike('crop_name', commodity)
    }

    if (state) {
      query = query.ilike('state', state)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase cache query error:', error)
      return { data: [], isFresh: false }
    }

    if (!data || data.length === 0) {
      return { data: [], isFresh: false }
    }

    // Check if the most recent data is fresh
    const isFresh = isCacheFresh(data[0].created_at || '')

    return { data, isFresh }
  } catch (error) {
    console.error('Error fetching from cache:', error)
    return { data: [], isFresh: false }
  }
}

/**
 * Upsert mandi prices to Supabase (insert or update on conflict)
 */
async function upsertMandiPrices(prices: SupabaseMandiPrice[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('mandi_prices')
      .upsert(prices, {
        onConflict: 'crop_name,mandi_name,recorded_date',
        ignoreDuplicates: false
      })

    if (error) {
      console.error('Supabase upsert error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error upserting to Supabase:', error)
    return false
  }
}

/**
 * Fetch mandi prices from Government of India API
 * Resource ID: 9ef84268-d588-465a-a308-a864a43d0070 (Agricultural Marketing - Price Data)
 */
/**
 * Fetch mandi prices with smart caching
 * 1. Check Supabase cache first
 * 2. If cache is fresh (< 12 hours), return cached data
 * 3. If cache is stale or empty, fetch from API and update cache
 * 4. If API fails, return stale cache with warning
 */
export async function getMandiPrices(
  commodity?: string,
  state?: string,
  limit: number = 100
): Promise<MandiPriceResponse & { fromCache?: boolean; isStale?: boolean }> {
  try {
    // Step 1: Check cache
    const { data: cachedData, isFresh } = await getMandiPricesFromCache(commodity, state, limit)

    // Step 2: If cache is fresh, return it
    if (isFresh && cachedData.length > 0) {
      console.log('✓ Using fresh cached mandi data')
      return {
        records: cachedData.map(d => ({
          state: d.state,
          district: d.district || '',
          market: d.mandi_name,
          commodity: d.crop_name,
          variety: d.variety || '',
          grade: d.grade || '',
          arrival_date: d.recorded_date,
          min_price: d.min_price || d.price_per_quintal,
          max_price: d.max_price || d.price_per_quintal,
          modal_price: d.modal_price || d.price_per_quintal
        })),
        total: cachedData.length,
        count: cachedData.length,
        fromCache: true,
        isStale: false
      }
    }

    // Step 3: Cache is stale or empty, fetch from API
    console.log('⟳ Fetching fresh data from Mandi API...')
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

    const resourceId = '9ef84268-d588-465a-a308-a864a43d0070'
    const url = `${MANDI_API_BASE_URL}/${resourceId}?${params.toString()}`

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Mandi API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Step 4: Transform and cache the new data
    if (data.records && data.records.length > 0) {
      const transformedData = data.records.map(transformToSupabaseFormat)
      const upsertSuccess = await upsertMandiPrices(transformedData)
      
      if (upsertSuccess) {
        console.log('✓ Cached', transformedData.length, 'mandi price records to Supabase')
      }
    }

    return {
      records: data.records || [],
      total: data.total || 0,
      count: data.count || 0,
      fromCache: false,
      isStale: false
    }
  } catch (error) {
    console.error('Error fetching mandi prices:', error)
    
    // Step 5: API failed - return stale cache if available
    const { data: cachedData } = await getMandiPricesFromCache(commodity, state, limit)
    
    if (cachedData.length > 0) {
      console.warn('⚠ Using stale cached data due to API failure')
      return {
        records: cachedData.map(d => ({
          state: d.state,
          district: d.district || '',
          market: d.mandi_name,
          commodity: d.crop_name,
          variety: d.variety || '',
          grade: d.grade || '',
          arrival_date: d.recorded_date,
          min_price: d.min_price || d.price_per_quintal,
          max_price: d.max_price || d.price_per_quintal,
          modal_price: d.modal_price || d.price_per_quintal
        })),
        total: cachedData.length,
        count: cachedData.length,
        fromCache: true,
        isStale: true
      }
    }

    // No cache available
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
    const latestPrice = sorted[0].modal_price
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
      const price = record.modal_price
      
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
      .map(r => r.modal_price)
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
