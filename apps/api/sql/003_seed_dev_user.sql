-- Seed: development user for local testing
-- Email: dev@tourcheetah.local
-- Password: password123

INSERT INTO users (email, password_hash, has_lifetime_access, lifetime_paid_at)
VALUES (
  'dev@tourcheetah.local',
  '$2a$12$RGyG7G0RHjAnPXiGtUup8eOowtGD.g92FlabNmuu0aFoqFXOJuJdC',
  TRUE,
  NOW()
)
ON CONFLICT (email)
DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  has_lifetime_access = EXCLUDED.has_lifetime_access,
  lifetime_paid_at = EXCLUDED.lifetime_paid_at,
  updated_at = NOW();
