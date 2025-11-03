import express from 'express';
import { shipmentController } from '../controllers/shipmentController.js';
import {
  authenticate,
  optionalAuthenticate,
} from '../middlewares/auth.js';
import {
  validate,
  validateQuery,
  shipmentSchemas,
} from '../utils/validation.js';

const router = express.Router();

// Create shipment (optionally authenticated for guest users)
router.post(
  '/',
  optionalAuthenticate,
  validate(shipmentSchemas.create),
  shipmentController.createShipment
);

// All other routes require authentication
router.use(authenticate);

router.get(
  '/',
  validateQuery(shipmentSchemas.query),
  shipmentController.getShipments
);

router.get('/:id', shipmentController.getShipmentById);

router.put(
  '/:id',
  validate(shipmentSchemas.update),
  shipmentController.updateShipment
);

router.post('/:id/cancel', shipmentController.cancelShipment);

export default router;

