import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import Stripe from 'stripe';
import type { Pool } from 'pg';
import { authRoutes } from './routes/auth.js';
import { productsRoutes } from './routes/products.js';
import { paymentsRoutes } from './routes/payments.js';
import { userRoutes } from './routes/user.js';
import { webhooksRoutes } from './routes/webhooks.js';
import { requireAuth } from './middleware/auth.js';

export function createApp(params: {
  pool: Pool;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  corsOrigins: string[];
  accessSecret: string;
  refreshSecret: string;
  nodeEnv: string;
  webUrl: string;
  stripePrices: {
    STRIPE_PRICE_LIFETIME: string;
  };
}) {
  const app = express();
  const stripe = new Stripe(params.stripeSecretKey, { apiVersion: '2024-06-20' });

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (params.corsOrigins.includes(origin)) return cb(null, true);
        return cb(new Error('CORS blocked'));
      },
      credentials: true
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));

  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 120
    })
  );

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/api/auth', authRoutes({ pool: params.pool, accessSecret: params.accessSecret, refreshSecret: params.refreshSecret, nodeEnv: params.nodeEnv }));
  app.use('/api/products', productsRoutes(params.stripePrices));

  app.use('/api/payments', requireAuth(params.accessSecret), paymentsRoutes({ stripe, pool: params.pool, webUrl: params.webUrl }));
  app.use('/api/user', requireAuth(params.accessSecret), userRoutes(params.pool));

  // Stripe webhook must use a raw body parser.
  app.use(
    '/api/webhooks',
    express.raw({ type: 'application/json' }),
    webhooksRoutes({
      stripe,
      pool: params.pool,
      webhookSecret: params.stripeWebhookSecret,
      lifetimePriceId: params.stripePrices.STRIPE_PRICE_LIFETIME
    })
  );

  return app;
}
