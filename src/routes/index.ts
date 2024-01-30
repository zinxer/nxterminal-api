import express, { Request, Response, NextFunction } from 'express';
import { validatePayload, setRateLimit, validateMandatoryParams } from '../middleware/validationMiddleware'
import configRoutes from '../routes/configRoutes'
import assetsRoutes from '../routes/assetRoutes'

const router = express.Router();

// API ROUTES
router.use('/api/config', validatePayload, setRateLimit(100), configRoutes);
router.use('/assets', validatePayload, setRateLimit(100), assetsRoutes)

export default router;
