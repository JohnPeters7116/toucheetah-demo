-- TourCheetah Phase 0 schema

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  stripe_customer_id VARCHAR(255),
  has_lifetime_access BOOLEAN NOT NULL DEFAULT FALSE,
  lifetime_paid_at TIMESTAMP,
  refresh_token_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_event_id VARCHAR(255) UNIQUE,
  stripe_checkout_session_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  amount_cents INTEGER,
  currency VARCHAR(3),
  status VARCHAR(50),
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
