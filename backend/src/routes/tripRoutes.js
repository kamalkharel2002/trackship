import express from 'express';
import { tripController } from '../controllers/tripController.js';
import { validateQuery, tripSchemas } from '../utils/validation.js';

const router = express.Router();

router.get(
  '/availability',
  validateQuery(tripSchemas.availability),
  tripController.getAvailability
);

export default router;

