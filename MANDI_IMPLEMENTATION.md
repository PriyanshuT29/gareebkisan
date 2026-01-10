# Real-Time Mandi Price Integration - Implementation Guide

## 📋 Overview

This document outlines the implementation of real-time mandi price fetching integrated with Supabase database for the KrishiBandhu platform.

## ✅ Implementation Status: COMPLETE

### What Was Implemented

1. **Database Schema Updates** - SQL script to enhance `mandi_prices` table
2. **Smart Caching Service** - Supabase-backed mandi price service with 12-hour cache
3. **UI Integration** - Seamless data flow with error handling and user warnings
4. **Environment Configuration** - Frontend environment variables setup

---

## 🗄️ Database Setup

### Step 1: Execute SQL Script

Navigate to your Supabase project dashboard:
1. Go to **SQL Editor**
2. Open the file: `database/alter_mandi_prices_table.sql`
3. Execute the entire script

This will:
- ✅ Add missing columns: `district`, `variety`, `grade`, `min_price`, `max_price`, `modal_price`, `created_at`, `updated_at`
- ✅ Create unique constraint to prevent duplicates (crop + market + date)
- ✅ Add performance indexes for fast queries
- ✅ Create auto-update trigger for `updated_at` timestamp

### Verification

Run this query in Supabase SQL Editor to verify:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'mandi_prices' AND table_schema = 'public';
```

Expected columns:
- id, crop_name, mandi_name, state, district, variety, grade
- price_per_quintal, min_price, max_price, modal_price
- recorded_date, created_at, updated_at

---

## 🔧 Files Modified

### 1. `.env` (NEW - Root Directory)
```env
VITE_SUPABASE_URL=https://dkkrhkqdhhaftmtosxfh.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_LxzYHB2Bs-z6WLtpcqcb5A_PqWHRSia
VITE_MANDI_API_KEY=579b464db66ec23bdd00000103b61ae65770414643985f03e5f9bbeb
```

**⚠️ IMPORTANT:** Add `.env` to `.gitignore` to prevent committing sensitive credentials!

### 2. `src/services/mandiService.ts` (UPDATED)

**Key Changes:**
- ✅ Integrated Supabase client
- ✅ Added smart caching logic (12-hour freshness check)
- ✅ Date parsing from DD/MM/YYYY to YYYY-MM-DD
- ✅ Upsert functionality with conflict handling
- ✅ Fallback to stale cache on API failures
- ✅ Field mapping: `modal_price` → `price_per_quintal`

**New Functions:**
- `parseMandiDate()` - Converts API date format to SQL date
- `isCacheFresh()` - Checks if cached data is < 12 hours old
- `transformToSupabaseFormat()` - Maps API fields to database schema
- `getMandiPricesFromCache()` - Queries Supabase for cached prices
- `upsertMandiPrices()` - Inserts/updates prices with duplicate prevention

**Modified Functions:**
- `getMandiPrices()` - Now checks cache first, fetches API only if needed
- `getLatestPrice()`, `getPriceTrend()`, `getPriceStatistics()` - Updated to work with new data types

### 3. `src/pages/MandiPrices.tsx` (UPDATED)

**Key Changes:**
- ✅ Added `dataWarning` state for displaying cache/error messages
- ✅ Enhanced error handling in `useEffect`
- ✅ Warning banner UI component (yellow alert)
- ✅ Shows stale data warnings when API fails

**User Experience:**
- Fresh data: No warnings, normal display
- Stale cache: Yellow warning "⚠️ Showing cached data. Real-time prices may be delayed."
- No UI design changes - only data source updated

### 4. `database/alter_mandi_prices_table.sql` (NEW)

Complete SQL script for database schema updates with comments and verification queries.

---

## 🔄 Data Flow Architecture

```
User Opens Mandi Prices Page
         ↓
    Check Supabase Cache
         ↓
    ┌────────────────┬──────────────┐
    │                │              │
Data Exists?    Data Fresh?    Data Stale?
    │            (<12 hrs)      (>12 hrs)
    │                │              │
    NO              YES            YES
    │                │              │
    ↓                ↓              ↓
Fetch API    Return Cache   Fetch API + Update Cache
    │                │              │
    ↓                ↓              ↓
Upsert DB    Display Data   Return New Data
    │                               │
    ↓                               ↓
Return Data                  Display Data
         ↓
    Display in UI

API Fails?
    ↓
Return Stale Cache + Warning Banner
```

---

## 📊 Field Mapping (API → Database)

| Mandi API Field | Supabase Column | Notes |
|----------------|-----------------|-------|
| `commodity` | `crop_name` | Primary identifier |
| `market` | `mandi_name` | Market name |
| `state` | `state` | Direct mapping |
| `district` | `district` | NEW column |
| `variety` | `variety` | NEW column |
| `grade` | `grade` | NEW column |
| `arrival_date` | `recorded_date` | Parsed from DD/MM/YYYY |
| `modal_price` | `price_per_quintal` | **Primary price field** |
| `modal_price` | `modal_price` | Also stored separately |
| `min_price` | `min_price` | NEW column |
| `max_price` | `max_price` | NEW column |

---

## 🚀 Testing Instructions

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Navigate to Mandi Prices
Open browser: `http://localhost:5173/dashboard/mandi-prices`

### 3. Expected Behavior

**First Load (No Cache):**
- Loading spinner appears
- API call to `data.gov.in`
- Data stored in Supabase
- Prices displayed in UI
- Console log: `"✓ Cached X mandi price records to Supabase"`

**Second Load (Fresh Cache):**
- Fast load (no API call)
- Data from Supabase
- No warnings
- Console log: `"✓ Using fresh cached mandi data"`

**After 12 Hours (Stale Cache):**
- API call triggered
- Cache updated
- Fresh data displayed

**API Failure:**
- Yellow warning banner appears
- Last cached data displayed
- Console log: `"⚠ Using stale cached data due to API failure"`

### 4. Verify Database

Check Supabase dashboard → Table Editor → `mandi_prices`:
- Records should appear after first API call
- Check `created_at` timestamps
- Verify unique constraint (try inserting duplicate manually - should fail)

---

## 🔐 Security Considerations

### Environment Variables
- ✅ `.env` file created in root (frontend)
- ⚠️ **CRITICAL:** Add `.env` to `.gitignore`
- ✅ Uses `VITE_` prefix (Vite requirement)
- ✅ Only `VITE_SUPABASE_ANON_KEY` is public-safe (RLS protected)

### Supabase Row Level Security (RLS)

**RECOMMENDED:** Add RLS policies to `mandi_prices` table:

```sql
-- Enable RLS
ALTER TABLE public.mandi_prices ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" 
ON public.mandi_prices FOR SELECT 
TO public 
USING (true);

-- Restrict inserts to authenticated users (optional)
CREATE POLICY "Allow authenticated inserts" 
ON public.mandi_prices FOR INSERT 
TO authenticated 
WITH CHECK (true);
```

---

## 📝 Configuration Summary

| Setting | Value | Reason |
|---------|-------|--------|
| Cache Duration | 12 hours | Daily price updates, balance freshness & API limits |
| Primary Price | `modal_price` | Most common market price (farmer-friendly) |
| Duplicate Key | crop + market + date | Prevents same entry multiple times |
| Error Strategy | Show stale cache + warning | Better UX than blank page |
| API Limit | 100 records | Sufficient for trend analysis |

---

## 🐛 Troubleshooting

### Issue: "Missing Supabase URL or Anon Key"
**Solution:** Ensure `.env` file is in root directory with correct `VITE_` prefix

### Issue: Supabase insert fails with "duplicate key violation"
**Solution:** This is expected! The unique constraint prevents duplicates - upsert handles it

### Issue: No data displayed
**Solution:** 
1. Check browser console for errors
2. Verify Supabase credentials in `.env`
3. Check Supabase dashboard for data
4. Test API directly: `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=YOUR_KEY&format=json&limit=2`

### Issue: API rate limit exceeded
**Solution:** Cache is designed to prevent this - data refreshes only every 12 hours

---

## 📈 Next Steps (Optional Enhancements)

1. **Backend Cron Job:** Move API fetching to server with scheduled tasks
2. **Webhooks:** Real-time updates when new prices available
3. **Price Alerts:** Notify farmers when prices hit targets
4. **Historical Charts:** Extended trend analysis beyond 30 days
5. **Bulk Import:** Initial data seeding for popular crops

---

## ✨ Summary

- ✅ Real-time mandi price fetching implemented
- ✅ Supabase integration with smart caching (12-hour TTL)
- ✅ Database schema updated with proper constraints
- ✅ UI displays live data with error handling
- ✅ No design changes - existing UI preserved
- ✅ Production-ready code with proper error handling

**Status:** Ready for production deployment after SQL script execution in Supabase.
