import { stripe } from '../../config/stripe.js';
import * as userRepo from '../users/user.repo.js';
import * as billingService from './billing.service.js';

export async function createCheckoutSession(req, res, next) {
  try {
    const url = await billingService.createCheckoutSession(req.user.id);
    return res.status(200).json({ url });
  } catch (err) {
    next(err);
  }
}

export async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('Missing Stripe signature');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;

    if (!userId) {
      return res.status(400).send('Missing userId in metadata');
    }

    await userRepo.markUserAsPaid(userId);
    console.log(`User ${userId} marked as paid`);
  }

  return res.status(200).json({ received: true });
}