/*
  # Consistent Coupon and Plan Types
  1. Updated Tables: coupons, plans
  2. Data Types: Consistent data types across database and application
  3. Notes: This migration ensures data type consistency for easier management.
*/
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    discount_percentage NUMERIC NOT NULL DEFAULT 0,
    applicable_plans TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    usage_limit INTEGER,
    used_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coupons are viewable by everyone"
  ON coupons
  FOR SELECT
  USING (TRUE);

CREATE POLICY "Plans are manageable by authenticated users"
  ON coupons
  FOR ALL
  TO authenticated
  USING (TRUE);

-- Plans Table
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price NUMERIC NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    billing_period TEXT NOT NULL DEFAULT 'monthly',
    features JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are viewable by everyone"
  ON plans
  FOR SELECT
  USING (TRUE);

CREATE POLICY "Plans are manageable by authenticated users"
  ON plans
  FOR ALL
  TO authenticated
  USING (TRUE);
