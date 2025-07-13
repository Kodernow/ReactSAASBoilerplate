/*
  # Create plans table

  1. New Tables
    - `plans`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `billing_period` (text)
      - `features` (jsonb)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `plans` table
    - Add policy for public read access to active plans
*/

CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  billing_period text NOT NULL DEFAULT 'monthly',
  features jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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