import express from 'express';
import userRoutes from './modules/users/user.routes.js';
import clientRoutes from './modules/clients/client.routes.js';
import invoiceRoutes from './modules/invoices/invoice.routes.js';
import billingRoutes from './modules/billing/billing.routes.js';
import errorHandler from './modules/utils/error.js';

const app = express();

app.use('/billing',billingRoutes);

app.use(express.json());

app.use('/users',userRoutes);

app.use('/clients',clientRoutes);

app.use('/invoices',invoiceRoutes);



app.use(errorHandler);


export default app;