-- =====================================================
-- SQL Script: Mandi Prices Table Schema Updates
-- Purpose: Add required columns, constraints, and indexes
-- Execute this in Supabase SQL Editor
-- =====================================================

-- 1. Add missing columns to match Mandi API response
ALTER TABLE public.mandi_prices 
ADD COLUMN IF NOT EXISTS district text,
ADD COLUMN IF NOT EXISTS variety text,
ADD COLUMN IF NOT EXISTS grade text,
ADD COLUMN IF NOT EXISTS min_price numeric,
ADD COLUMN IF NOT EXISTS max_price numeric,
ADD COLUMN IF NOT EXISTS modal_price numeric,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- 2. Update existing price_per_quintal to match modal_price
-- (This will be populated by the application with modal_price values)

-- 3. Create unique constraint to prevent duplicate entries
-- Duplicates are defined as same crop + market + date
CREATE UNIQUE INDEX IF NOT EXISTS idx_mandi_unique_entry 
ON public.mandi_prices (crop_name, mandi_name, recorded_date);

-- 4. Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_mandi_commodity 
ON public.mandi_prices (crop_name);

CREATE INDEX IF NOT EXISTS idx_mandi_state 
ON public.mandi_prices (state);

CREATE INDEX IF NOT EXISTS idx_mandi_date 
ON public.mandi_prices (recorded_date DESC);

CREATE INDEX IF NOT EXISTS idx_mandi_market 
ON public.mandi_prices (mandi_name);

CREATE INDEX IF NOT EXISTS idx_mandi_created_at 
ON public.mandi_prices (created_at DESC);

-- 5. Create a function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_mandi_prices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger to auto-update 'updated_at' on row updates
DROP TRIGGER IF EXISTS trigger_update_mandi_prices_updated_at ON public.mandi_prices;
CREATE TRIGGER trigger_update_mandi_prices_updated_at
  BEFORE UPDATE ON public.mandi_prices
  FOR EACH ROW
  EXECUTE FUNCTION update_mandi_prices_updated_at();

-- 7. Verify the schema
-- Run this to confirm all columns exist:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'mandi_prices' AND table_schema = 'public';

-- =====================================================
-- NOTES:
-- - modal_price will be mapped to price_per_quintal
-- - Unique constraint prevents duplicates per commodity+market+date
-- - Indexes improve query performance for common lookups
-- - updated_at automatically tracks when records change
-- =====================================================
