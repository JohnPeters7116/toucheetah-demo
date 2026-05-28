import 'dotenv/config';
import { loadEnv } from './config/env.js';
import { createPool } from './db/pool.js';
import { createApp } from './app.js';

const env = loadEnv(process.env);
const pool = createPool(env.DATABASE_URL);

const corsOrigins = env.CORS_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean);

// For now this points back to the Vite dev server. In prod, set it to your deployed web URL.
const webUrl = corsOrigins[0] ?? 'http://localhost:5173';

const app = createApp({
  pool,
  stripeSecretKey: env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
  corsOrigins,
  accessSecret: env.JWT_ACCESS_SECRET,
  refreshSecret: env.JWT_REFRESH_SECRET,
  nodeEnv: env.NODE_ENV,
  webUrl,
  stripePrices: {
    STRIPE_PRICE_LIFETIME: env.STRIPE_PRICE_LIFETIME,
  }
});

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${env.PORT}`);
});
