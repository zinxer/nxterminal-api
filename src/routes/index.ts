import express, { Request, Response, NextFunction } from 'express';
import { validatePayload, setRateLimit } from '../middleware/validationMiddleware'
import configRoutes from '../routes/configRoutes'

const router = express.Router();

// API ROUTES
router.use('/api/', validatePayload, setRateLimit(100), configRoutes);

export default router;
