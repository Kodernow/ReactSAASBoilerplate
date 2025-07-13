/*
  # Create plans table
  1. New Tables: plans (id uuid, name text, description text, price numeric, currency text, billing_period text, features jsonb, is_active boolean, created_at timestamp, updated_at timestamp)
  2. Security: Enable RLS, add read policy for authenticated users
*/
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    billing_period TEXT NOT NULL,
    features JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans are viewable by everyone" ON plans FOR SELECT USING (TRUE);
