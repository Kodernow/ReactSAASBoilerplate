/*
  # Create users table
  1. New Tables: users (id uuid, email text, is_active boolean)
  2. Security: Enable RLS, add read policy for authenticated users
*/
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own record." ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own record." ON users FOR UPDATE USING (auth.uid() = id);
