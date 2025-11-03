import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import shipmentRoutes from './shipmentRoutes.js';
import parcelRoutes from './parcelRoutes.js';
import parcelDirectRoutes from './parcelDirectRoutes.js';
import hubRoutes from './hubRoutes.js';
import tripRoutes from './tripRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/shipments', shipmentRoutes);
// Parcels nested under shipments
router.use('/shipments', parcelRoutes);
// Direct parcel routes (PUT /parcels/:id, DELETE /parcels/:id)
router.use('/parcels', parcelDirectRoutes);
router.use('/hubs', hubRoutes);
router.use('/trips', tripRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;

