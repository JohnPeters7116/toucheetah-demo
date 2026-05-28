import jwt from 'jsonwebtoken';

export type JwtUser = { sub: string; email: string };

export function signAccessToken(payload: JwtUser, secret: string) {
  return jwt.sign(payload, secret, { expiresIn: '15m' });
}

export function signRefreshToken(payload: JwtUser, secret: string) {
  return jwt.sign(payload, secret, { expiresIn: '30d' });
}

export function verifyToken<T extends object>(token: string, secret: string): T {
  return jwt.verify(token, secret) as T;
}
