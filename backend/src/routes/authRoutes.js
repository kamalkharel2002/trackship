import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, authSchemas } from '../utils/validation.js';

const router = express.Router();

router.post(
  '/request-otp',
  validate(authSchemas.requestOTP),
  authController.requestOTP
);

router.post(
  '/verify-otp',
  validate(authSchemas.verifyOTP),
  authController.verifyOTP
);

router.post(
  '/login',
  validate(authSchemas.login),
  authController.login
);

router.post(
  '/refresh',
  validate(authSchemas.refresh),
  authController.refresh
);

router.post('/logout', authenticate, authController.logout);

export default router;

