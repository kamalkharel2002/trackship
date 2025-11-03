import express from 'express';
import { parcelController } from '../controllers/parcelController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, parcelSchemas } from '../utils/validation.js';

const router = express.Router();

router.use(authenticate); // All routes require authentication

// Parcel routes nested under shipments
// POST /shipments/:shipmentId/parcels
router.post(
  '/:shipmentId/parcels',
  validate(parcelSchemas.create),
  parcelController.createParcel
);

export default router;

