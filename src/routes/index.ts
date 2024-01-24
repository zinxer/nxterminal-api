import express, { Request, Response, NextFunction } from 'express';
import { validatePayload, setRateLimit } from '../middleware/validationMiddleware'
import marketDataRoutes from '../routes/marketDataRoutes'

const router = express.Router();

// API ROUTES
router.use('/api/', validatePayload, setRateLimit(100), marketDataRoutes);

export default router;
