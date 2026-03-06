# Invoice App API

A REST API for freelancers to manage clients, generate invoices as PDFs, and collect payments via Stripe. Built with Node.js, Express, and PostgreSQL.

**Live API:** `https://invoice-app-4x1f.onrender.com`

---

## Features

- JWT authentication (register, login)
- Client management (create, list)
- Invoice management (create, list, update status)
- PDF invoice generation served over HTTP
- Stripe subscription payments ($9/month)
- Free tier enforcement (3 invoices, 3 clients)
- Stripe webhook handling to unlock paid access
- Zod input validation on all endpoints
- Global error handling

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT)
- **Payments:** Stripe
- **Validation:** Zod
- **PDF Generation:** PDFKit
- **Deployment:** Render

---

## Architecture

Requests flow through a strict layered architecture with no layer skipping:

```
HTTP Request
     │
  Routes         → maps URLs to controller functions
     │
  Controllers    → unpacks req, calls service, sends res
     │
  Services       → business logic and rules
     │
  Repositories   → all SQL queries live here
     │
  PostgreSQL
```

```
src/
├── config/
│   ├── db.js                  # PostgreSQL connection pool
│   └── stripe.js              # Stripe client instance
├── middlewares/
│   ├── auth.middleware.js     # JWT verification
│   └── validate.middleware.js # Zod schema validation
├── modules/
│   ├── billing/
│   │   ├── billing.controller.js
│   │   ├── billing.routes.js
│   │   └── billing.service.js
│   ├── clients/
│   │   ├── client.controller.js
│   │   ├── client.repo.js
│   │   ├── client.routes.js
│   │   └── client.service.js
│   ├── invoices/
│   │   ├── invoice.controller.js
│   │   ├── invoice.repo.js
│   │   ├── invoice.routes.js
│   │   └── invoices.service.js
│   ├── services/
│   │   └── pdf.service.js     # PDF generation
│   ├── users/
│   │   ├── user.controller.js
│   │   ├── user.repo.js
│   │   ├── user.routes.js
│   │   └── user.service.js
│   └── utils/
│       ├── error.js           # Global error handler
│       ├── jwt.js             # Token sign and verify
│       └── schemas.js         # Zod validation schemas
├── app.js
└── server.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- Stripe account

### Installation

```bash
git clone https://github.com/maro1701/invoice-app.git
cd invoice-app
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
DATABASE_URL=postgresql://user:password@localhost:5432/invoice
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Database Setup

```bash
psql -U postgres -d your_database -f schema.sql
```

### Run Locally

```bash
npm run dev
```

---

## API Reference

All protected routes require:
```
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/users/register` | Register a new user | No |
| POST | `/users/login` | Login and receive JWT | No |

**Register / Login body:**
```json
{
  "email": "user@email.com",
  "password": "123456"
}
```

---

### Clients

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/clients` | Create a client | Yes |
| GET | `/clients` | List all clients | Yes |

**Create client body:**
```json
{
  "name": "Acme Corp",
  "email": "acme@email.com",
  "phone": "123-456-7890"
}
```

---

### Invoices

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/invoices` | Create an invoice | Yes |
| GET | `/invoices` | List all invoices | Yes |
| PATCH | `/invoices/:id/status` | Update invoice status | Yes |
| GET | `/invoices/:id/with-client` | Get invoice with client details | Yes |
| GET | `/invoices/:id/pdf` | Download invoice as PDF | Yes |

**Create invoice body:**
```json
{
  "client_id": "uuid",
  "description": "Backend development",
  "amount": 500,
  "due_date": "2026-04-01"
}
```

**Update status body:**
```json
{
  "status": "paid"
}
```
Valid status values: `unpaid`, `paid`, `overdue`

**PDF download:**
In Postman → Send → Save Response → Save to file → open as `.pdf`

---

### Billing

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/billing/checkout` | Create Stripe checkout session | Yes |
| POST | `/billing/webhook` | Stripe webhook handler | No (Stripe only) |

**Checkout response:**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

Open the URL in a browser to complete payment. Use test card `4242 4242 4242 4242` with any future expiry and any CVC.

---

## Free Tier Limits

| Feature | Free | Pro ($9/month) |
|---------|------|----------------|
| Invoices | 3 | Unlimited |
| Clients | 3 | Unlimited |
| PDF generation | ✅ | ✅ |
| Stripe payments | ❌ | ✅ |

When the free tier limit is reached:
```json
{
  "message": "Free tier limit reached. Upgrade to Pro at /billing/checkout"
}
```

---

## Validation Errors

All invalid requests return structured errors:
```json
{
  "errors": [
    { "field": "email", "message": "Invalid email" },
    { "field": "amount", "message": "Amount must be positive" }
  ]
}
```

---

## Database Schema

```sql
users      → id, email, password_hash, is_paid, created_at
clients    → id, user_id, name, email, phone, created_at
invoices   → id, user_id, client_id, description, amount, status, due_date, created_at
```

Foreign keys enforce cascade deletion — deleting a user removes all their clients and invoices.

---

## Stripe Webhook Setup

For local development, use ngrok to expose your local server:

```bash
ngrok http 8000
```

Add the ngrok URL as a Stripe webhook endpoint:
```
https://your-ngrok-url.ngrok-free.dev/billing/webhook
```

Event to listen for: `checkout.session.completed`

---

## Deployment

Deployed on Render with a managed PostgreSQL database. Any push to `main` triggers an automatic redeploy.

Environment variables are configured securely in the Render dashboard and never committed to the repository.
