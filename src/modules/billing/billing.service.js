import { stripe } from '../../config/stripe.js';

export async function createCheckoutSession(userId) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',        // ← subscription not payment (recurring monthly)
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Invoice Tool Pro',
            description: 'Unlimited invoices and clients'
          },
          unit_amount: 900,       // $9.00 in cents
          recurring: {
            interval: 'month'
          }
        },
        quantity: 1
      }
    ],
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    metadata: { userId }         // ← this is how webhook knows which user paid
  });

  return session.url;
}