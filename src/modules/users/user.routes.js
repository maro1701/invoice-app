// user.routes.js
import express from 'express';
import { register, login } from './user.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../utils/schemas.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;