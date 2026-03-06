// client.routes.js
import express from 'express';
import { createClient, getClient } from './client.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { clientSchema } from '../utils/schemas.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', validate(clientSchema), createClient);
router.get('/', getClient);

export default router;