import { Router } from 'express';
import * as authController from './auth.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import authenticate from '../../middlewares/auth.middlware.js';
import { registerSchema, loginSchema } from './auth.validation.js';

const router = Router();

// Public
router.post('/register', validate(registerSchema), authController.register);
router.post('/login',    validate(loginSchema),    authController.login);

// Protected
router.post('/logout', authenticate, authController.logout);
router.get('/me',      authenticate, authController.getMe);

export default router;
