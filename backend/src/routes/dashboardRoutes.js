import express from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate); // All routes require authentication

router.get('/', dashboardController.getDashboard);

export default router;

