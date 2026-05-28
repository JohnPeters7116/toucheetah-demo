import { Router } from 'express';
import { z } from 'zod';
import type Stripe from 'stripe';
import type { Pool } from 'pg';
import { findUserById, setUserStripeCustomerId } from '../db/users.js';

const createSessionSchema = z.object({ priceId: z.string().min(1) });

export function paymentsRoutes(params: {
  stripe: Stripe;
  pool: Pool;
  webUrl: string;
}) {
  const r = Router();

  r.post('/create-checkout-session', async (req, res) => {
    const parsed = createSessionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

    const auth = req.auth;
    if (!auth) return res.status(401).json({ error: 'Unauthorized' });

    const user = await findUserById(params.pool, auth.sub);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await params.stripe.customers.create({ email: user.email, metadata: { userId: user.id } });
      customerId = customer.id;
      await setUserStripeCustomerId(params.pool, user.id, customerId);
    }

    const session = await params.stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: [{ price: parsed.data.priceId, quantity: 1 }],
      success_url: `${params.webUrl}/#/pricing?success=1`,
      cancel_url: `${params.webUrl}/#/pricing?canceled=1`,
      metadata: { userId: user.id }
    });

    return res.json({ url: session.url });
  });

  return r;
}
