/*
  # Create coupons table
  1. New Tables: coupons (id uuid, code text, discount numeric, expires_at timestamp, usage_limit integer, used_count integer, is_active boolean, created_at timestamp, updated_at timestamp)
  2. Security: Enable RLS, add read policy for authenticated users
*/
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount NUMERIC NOT NULL,
    expires_at TIMESTAMPTZ,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coupons are viewable by everyone" ON coupons FOR SELECT USING (TRUE);
