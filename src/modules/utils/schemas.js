// src/modules/utils/schemas.js

import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional()
});

export const invoiceSchema = z.object({
  client_id: z.string().uuid('Invalid client ID'),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  due_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format'
  })
});

export const statusSchema = z.object({
  status: z.enum(['unpaid', 'paid', 'overdue'], {
    errorMap: () => ({ message: 'Status must be unpaid, paid or overdue' })
  })
});