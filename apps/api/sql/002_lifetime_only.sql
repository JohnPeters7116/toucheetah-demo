-- Migration: switch to lifetime-only access model

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS has_lifetime_access BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS lifetime_paid_at TIMESTAMP;

ALTER TABLE users
  DROP COLUMN IF EXISTS subscription_status,
  DROP COLUMN IF EXISTS subscription_id,
  DROP COLUMN IF EXISTS subscription_plan;

ALTER TABLE payments
  DROP COLUMN IF EXISTS stripe_subscription_id;
