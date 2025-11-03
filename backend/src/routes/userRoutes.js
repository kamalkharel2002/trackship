import express from 'express';
import { userController } from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, userSchemas } from '../utils/validation.js';

const router = express.Router();

router.use(authenticate); // All routes require authentication

router.get('/me', userController.getMe);

router.put('/me', validate(userSchemas.updateMe), userController.updateMe);

export default router;

