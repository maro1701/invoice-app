import PDFDocument from 'pdfkit';

export function generateInvoicePDF(invoice, client, user) {
  return new Promise((resolve, reject) => {
    console.log('PDF DATA:', { invoice, client }); // ← add this
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers))); // ✅ listener ready first
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    // Invoice details
    doc.fontSize(12).text(`Invoice ID: ${invoice.id}`);
    doc.text(`Client: ${client.name}`);
    doc.text(`Email: ${client.email}`);
    doc.moveDown();

    doc.text(`Description: ${invoice.description}`);
    doc.text(`Amount: $${invoice.amount}`);
    doc.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`);
    doc.text(`Status: ${invoice.status}`);

    doc.end(); // ✅ called last, inside Promise
  });
}