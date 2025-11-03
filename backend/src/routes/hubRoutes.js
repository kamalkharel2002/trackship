import express from 'express';
import { hubController } from '../controllers/hubController.js';

const router = express.Router();

router.get('/', hubController.getHubs);

export default router;

