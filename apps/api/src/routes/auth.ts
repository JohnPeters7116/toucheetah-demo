import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { Pool } from 'pg';
import { createUser, findUserByEmail, setUserRefreshTokenHash } from '../db/users.js';
import { signAccessToken, signRefreshToken, verifyToken, type JwtUser } from '../lib/jwt.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = registerSchema;

export function authRoutes(params: {
  pool: Pool;
  accessSecret: string;
  refreshSecret: string;
  nodeEnv: string;
}) {
  const r = Router();

  r.post('/register', async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

    const email = parsed.data.email.toLowerCase().trim();
    const existing = await findUserByEmail(params.pool, email);
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await createUser(params.pool, { email, passwordHash });

    const jwtUser: JwtUser = { sub: user.id, email: user.email };
    const accessToken = signAccessToken(jwtUser, params.accessSecret);
    const refreshToken = signRefreshToken(jwtUser, params.refreshSecret);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await setUserRefreshTokenHash(params.pool, user.id, refreshTokenHash);

    res.cookie('tc_refresh', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: params.nodeEnv === 'production',
      path: '/api/auth/refresh-token',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    return res.status(201).json({ token: accessToken, user: { id: user.id, email: user.email } });
  });

  r.post('/login', async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

    const email = parsed.data.email.toLowerCase().trim();
    const user = await findUserByEmail(params.pool, email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(parsed.data.password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const jwtUser: JwtUser = { sub: user.id, email: user.email };
    const accessToken = signAccessToken(jwtUser, params.accessSecret);
    const refreshToken = signRefreshToken(jwtUser, params.refreshSecret);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await setUserRefreshTokenHash(params.pool, user.id, refreshTokenHash);

    res.cookie('tc_refresh', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: params.nodeEnv === 'production',
      path: '/api/auth/refresh-token',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    return res.json({ token: accessToken, user: { id: user.id, email: user.email } });
  });

  r.post('/logout', async (req, res) => {
    // Best-effort: clear cookie. If access token is provided, also clear refresh hash.
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      try {
        const decoded = verifyToken<JwtUser>(header.slice('Bearer '.length), params.accessSecret);
        await setUserRefreshTokenHash(params.pool, decoded.sub, null);
      } catch {
        // ignore
      }
    }

    res.clearCookie('tc_refresh', { path: '/api/auth/refresh-token' });
    return res.json({ ok: true });
  });

  r.post('/refresh-token', async (req, res) => {
    const token = req.cookies?.tc_refresh;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    let decoded: JwtUser;
    try {
      decoded = verifyToken<JwtUser>(token, params.refreshSecret);
    } catch {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await findUserByEmail(params.pool, decoded.email);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!user.refresh_token_hash) return res.status(401).json({ error: 'Unauthorized' });

    const ok = await bcrypt.compare(token, user.refresh_token_hash);
    if (!ok) return res.status(401).json({ error: 'Unauthorized' });

    const accessToken = signAccessToken({ sub: user.id, email: user.email }, params.accessSecret);
    return res.json({ token: accessToken });
  });

  return r;
}
