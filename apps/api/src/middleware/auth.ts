import type { RequestHandler } from 'express';
import { verifyToken, type JwtUser } from '../lib/jwt.js';

declare global {
  namespace Express {
    interface Request {
      auth?: JwtUser;
    }
  }
}

export function requireAuth(accessSecret: string): RequestHandler {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = header.slice('Bearer '.length);
    try {
      const decoded = verifyToken<JwtUser>(token, accessSecret);
      req.auth = decoded;
      next();
    } catch {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
}
