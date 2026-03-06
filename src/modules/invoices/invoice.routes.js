// invoice.routes.js
import express from 'express';
import {
  createInvoice,
  getInvoices,
  getInvoicePDF,
  markInvoiceStatus,
  getInvoiceWithClient
} from './invoice.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { invoiceSchema, statusSchema } from '../utils/schemas.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', validate(invoiceSchema), createInvoice);
router.get('/', getInvoices);
router.get('/:id/pdf', getInvoicePDF);
router.patch('/:id/status', validate(statusSchema), markInvoiceStatus);
router.get('/:id/with-client', getInvoiceWithClient);

export default router;