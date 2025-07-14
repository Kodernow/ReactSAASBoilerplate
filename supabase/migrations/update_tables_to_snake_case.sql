/*
  # Update Tables to Snake Case
  1. Updated Tables: plans, plan_features, user_subscriptions, user_profiles, payment_intents
  2. Columns: Renamed columns to snake_case for consistency.
  3. Notes: This migration updates column names to use snake_case for better consistency with the database schema.  It uses a DO block to conditionally rename columns.
*/

DO $$
BEGIN
  -- Plans Table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'name' AND column_name <> 'name') THEN
    ALTER TABLE plans RENAME COLUMN "name" TO name;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'description' AND column_name <> 'description') THEN
    ALTER TABLE plans RENAME COLUMN "description" TO description;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'price' AND column_name <> 'price') THEN
    ALTER TABLE plans RENAME COLUMN "price" TO price;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'currency' AND column_name <> 'currency') THEN
    ALTER TABLE plans RENAME COLUMN "currency" TO currency;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'billingPeriod' AND column_name <> 'billing_period') THEN
    ALTER TABLE plans RENAME COLUMN "billingPeriod" TO billing_period;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'features' AND column_name <> 'features') THEN
    ALTER TABLE plans RENAME COLUMN "features" TO features;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'isActive' AND column_name <> 'is_active') THEN
    ALTER TABLE plans RENAME COLUMN "isActive" TO is_active;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'createdAt' AND column_name <> 'created_at') THEN
    ALTER TABLE plans RENAME COLUMN "createdAt" TO created_at;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'updatedAt' AND column_name <> 'updated_at') THEN
    ALTER TABLE plans RENAME COLUMN "updatedAt" TO updated_at;
  END IF;

  -- UserSubscriptions Table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'userId' AND column_name <> 'user_id') THEN
    ALTER TABLE user_subscriptions RENAME COLUMN "userId" TO user_id;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'planId' AND column_name <> 'plan_id') THEN
    ALTER TABLE user_subscriptions RENAME COLUMN "planId" TO plan_id;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'startDate' AND column_name <> 'start_date') THEN
    ALTER TABLE user_subscriptions RENAME COLUMN "startDate" TO start_date;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'endDate' AND column_name <> 'end_date') THEN
    ALTER TABLE user_subscriptions RENAME COLUMN "endDate" TO end_date;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'paymentMethod' AND column_name <> 'payment_method') THEN
    ALTER TABLE user_subscriptions RENAME COLUMN "paymentMethod" TO payment_method;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'stripeSubscriptionId' AND column_name <> 'stripe_subscription_id') THEN
    ALTER TABLE user_subscriptions RENAME COLUMN "stripeSubscriptionId" TO stripe_subscription_id;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'razorpaySubscriptionId' AND column_name <> 'razorpay_subscription_id') THEN
    ALTER TABLE user_subscriptions RENAME COLUMN "razorpaySubscriptionId" TO razorpay_subscription_id;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'createdAt' AND column_name <> 'created_at') THEN
    ALTER TABLE user_subscriptions RENAME COLUMN "createdAt" TO created_at;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'updatedAt' AND column_name <> 'updated_at') THEN
    ALTER TABLE user_subscriptions RENAME COLUMN "updatedAt" TO updated_at;
  END IF;

  -- UserProfiles Table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'fullName' AND column_name <> 'full_name') THEN
    ALTER TABLE user_profiles RENAME COLUMN "fullName" TO full_name;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'isAdmin' AND column_name <> 'is_admin') THEN
    ALTER TABLE user_profiles RENAME COLUMN "isAdmin" TO is_admin;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'lastLoginAt' AND column_name <> 'last_login_at') THEN
    ALTER TABLE user_profiles RENAME COLUMN "lastLoginAt" TO last_login_at;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'isActive' AND column_name <> 'is_active') THEN
    ALTER TABLE user_profiles RENAME COLUMN "isActive" TO is_active;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'createdAt' AND column_name <> 'created_at') THEN
    ALTER TABLE user_profiles RENAME COLUMN "createdAt" TO created_at;
  END IF;

  -- PaymentIntents Table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_intents' AND column_name = 'userId' AND column_name <> 'user_id') THEN
    ALTER TABLE payment_intents RENAME COLUMN "userId" TO user_id;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_intents' AND column_name = 'planId' AND column_name <> 'plan_id') THEN
    ALTER TABLE payment_intents RENAME COLUMN "planId" TO plan_id;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_intents' AND column_name = 'couponId' AND column_name <> 'coupon_id') THEN
    ALTER TABLE payment_intents RENAME COLUMN "couponId" TO coupon_id;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_intents' AND column_name = 'paymentMethod' AND column_name <> 'payment_method') THEN
    ALTER TABLE payment_intents RENAME COLUMN "paymentMethod" TO payment_method;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_intents' AND column_name = 'createdAt' AND column_name <> 'created_at') THEN
    ALTER TABLE payment_intents RENAME COLUMN "createdAt" TO created_at;
  END IF;
END $$;