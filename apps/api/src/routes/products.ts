import { Router } from 'express';

export function productsRoutes(env: {
  STRIPE_PRICE_LIFETIME: string;
}) {
  const r = Router();

  r.get('/', (_req, res) => {
    return res.json({
      products: [
        { id: 'lifetime', name: 'Tour Cheetah Lifetime', type: 'one_time', priceId: env.STRIPE_PRICE_LIFETIME }
      ]
    });
  });

  return r;
}
