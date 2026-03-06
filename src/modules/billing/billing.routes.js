import express from 'express';
import { handleWebhook, createCheckoutSession } from './billing.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// webhook must stay raw — no auth middleware, Stripe calls this directly
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

// checkout needs auth — only logged in users can start a payment
router.post('/checkout', authMiddleware, createCheckoutSession);

export default router;