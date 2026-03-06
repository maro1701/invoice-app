import * as invoiceRepo from './invoice.repo.js';
import * as clientRepo from '../clients/client.repo.js';

const FREE_LIMIT =3;

export async function createInvoice(userId,data,isPaid){
   const client = await clientRepo.findClientById(data.client_id);
   if(!client|| client.user_id !== userId) throw new Error('Invalid Client');
   
   if(!isPaid){
      const count = await invoiceRepo.countInvoicesByUser(userId);
      if(count>= FREE_LIMIT){
         throw new Error (`Free tier limit reached. Upgrade to Pro at /billing/checkout`);
      }
   }
   return invoiceRepo.createInvoice(userId,data);
}

export async function getInvoices(userId){
   return invoiceRepo.getInvoice(userId);
}

export async function markInvoiceStatus(invoiceId, status, userId) {
  // first confirm this invoice belongs to this user
  const invoice = await invoiceRepo.findInvoiceById(invoiceId, userId);
  if (!invoice) throw new Error('Invoice not found');

  return invoiceRepo.updateInvoiceStatus(invoiceId, status);
}

export async function getInvoiceWithClient(invoiceId,userId){
   const invoice = await invoiceRepo.findInvoiceById(invoiceId,userId);
   
   if(!invoice) throw new Error('Invoice not found');
   const client = await clientRepo.findClientById(invoice.client_id);

   return {invoice,client};
}