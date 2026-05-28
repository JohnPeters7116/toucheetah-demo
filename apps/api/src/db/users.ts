import type { Pool } from 'pg';

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  stripe_customer_id: string | null;
  has_lifetime_access: boolean;
  lifetime_paid_at: string | null;
  refresh_token_hash: string | null;
};

export async function findUserByEmail(pool: Pool, email: string): Promise<UserRow | null> {
  const res = await pool.query<UserRow>(
    'SELECT id, email, password_hash, stripe_customer_id, has_lifetime_access, lifetime_paid_at, refresh_token_hash FROM users WHERE email = $1',
    [email]
  );
  return res.rows[0] ?? null;
}

export async function findUserById(pool: Pool, userId: string): Promise<UserRow | null> {
  const res = await pool.query<UserRow>(
    'SELECT id, email, password_hash, stripe_customer_id, has_lifetime_access, lifetime_paid_at, refresh_token_hash FROM users WHERE id = $1',
    [userId]
  );
  return res.rows[0] ?? null;
}

export async function createUser(pool: Pool, params: { email: string; passwordHash: string }) {
  const res = await pool.query<{ id: string; email: string }>(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
    [params.email, params.passwordHash]
  );
  return res.rows[0];
}

export async function setUserStripeCustomerId(pool: Pool, userId: string, customerId: string) {
  await pool.query('UPDATE users SET stripe_customer_id = $1, updated_at = NOW() WHERE id = $2', [customerId, userId]);
}

export async function setUserRefreshTokenHash(pool: Pool, userId: string, refreshTokenHash: string | null) {
  await pool.query('UPDATE users SET refresh_token_hash = $1, updated_at = NOW() WHERE id = $2', [refreshTokenHash, userId]);
}

export async function grantLifetimeAccessByStripeCustomerId(
  pool: Pool,
  params: {
    stripeCustomerId: string;
  }
) {
  await pool.query(
    'UPDATE users SET has_lifetime_access = TRUE, lifetime_paid_at = COALESCE(lifetime_paid_at, NOW()), updated_at = NOW() WHERE stripe_customer_id = $1',
    [params.stripeCustomerId]
  );
}
