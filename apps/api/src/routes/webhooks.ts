import { Router } from 'express';
import type Stripe from 'stripe';
import type { Pool } from 'pg';
import { grantLifetimeAccessByStripeCustomerId } from '../db/users.js';

export function webhooksRoutes(params: {
  stripe: Stripe;
  pool: Pool;
  webhookSecret: string;
  lifetimePriceId: string;
}) {
  const r = Router();

  // Raw body is required for Stripe signature verification.
  r.post('/stripe', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    if (!sig || Array.isArray(sig)) return res.status(400).send('Missing signature');

    let event: Stripe.Event;
    try {
      event = params.stripe.webhooks.constructEvent(req.body, sig, params.webhookSecret);
    } catch {
      return res.status(400).send('Invalid signature');
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.mode !== 'payment') break;
          if (session.customer && typeof session.customer === 'string') {
            // Only grant access for the configured lifetime price.
            const lineItems = await params.stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
            const priceId = lineItems.data[0]?.price?.id;
            if (priceId === params.lifetimePriceId) {
              await grantLifetimeAccessByStripeCustomerId(params.pool, { stripeCustomerId: session.customer });
            }
          }
          break;
        }
        default:
          break;
      }

      return res.json({ received: true });
    } catch {
      return res.status(500).send('Webhook handler failed');
    }
  });

  return r;
}
