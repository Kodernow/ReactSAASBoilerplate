/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `subscription_plan` (text)
      - `subscription_status` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read their own data
    - Add policy for authenticated users to read all users (for admin)
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  subscription_plan text DEFAULT 'free',
  subscription_status text DEFAULT 'active',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Authenticated users can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (TRUE);