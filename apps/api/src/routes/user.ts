import { Router } from 'express';
import type { Pool } from 'pg';
import { findUserById } from '../db/users.js';

export function userRoutes(pool: Pool) {
  const r = Router();

  r.get('/subscription', async (req, res) => {
    const auth = req.auth;
    if (!auth) return res.status(401).json({ error: 'Unauthorized' });

    const user = await findUserById(pool, auth.sub);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    return res.json({
      access: {
        hasLifetimeAccess: user.has_lifetime_access,
        lifetimePaidAt: user.lifetime_paid_at
      }
    });
  });

  return r;
}
