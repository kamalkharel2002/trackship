import express from 'express';
import { parcelController } from '../controllers/parcelController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, parcelSchemas } from '../utils/validation.js';

const router = express.Router();

router.use(authenticate); // All routes require authentication

// Direct parcel routes
// PUT /parcels/:id
router.put('/:id', validate(parcelSchemas.update), parcelController.updateParcel);

// DELETE /parcels/:id
router.delete('/:id', parcelController.deleteParcel);

export default router;

