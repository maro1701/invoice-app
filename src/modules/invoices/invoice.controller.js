import * as invoiceService from './invoices.service.js';
import { generateInvoicePDF } from '../services/pdf.service.js';

export async function createInvoice(req, res, next) {
  try {
    const invoice = await invoiceService.createInvoice(req.user.id, req.body,req.user.is_paid);
    return res.status(201).json({ invoice });
  } catch (err) {
    next(err);
  }
}

export async function getInvoices(req, res, next) {
  try {
    const invoice = await invoiceService.getInvoices(req.user.id);
    return res.status(200).json({ invoice });
  } catch (err) {
    next(err);
  }
}

export async function markInvoiceStatus(req, res, next) {
  try {
    const { status } = req.body;



    const updated = await invoiceService.markInvoiceStatus(
      req.params.id,
      status,
      req.user.id
    );

    return res.status(200).json({ invoice: updated });
  } catch (err) {
    next(err);
  }
}

export async function getInvoiceWithClient(req, res, next) {
  try {
    const result = await invoiceService.getInvoiceWithClient(
      req.params.id,
      req.user.id
    );
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getInvoicePDF(req, res, next) {
  try {
    const { invoice, client } = await invoiceService.getInvoiceWithClient(
      req.params.id,
      req.user.id
    );

    const pdfBuffer = await generateInvoicePDF(invoice, client, req.user);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.id}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
}