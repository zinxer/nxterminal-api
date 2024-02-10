import express from 'express';
import { validatePayload, setRateLimit, validateBrokerApiKey } from '../middleware/validationMiddleware'
import configRoutes from '../routes/configRoutes'
import assetsRoutes from '../routes/assetRoutes'
import authRoutes from '../routes/authRoutes'
import brokerRoutes from '../routes/brokerRoutes'
import userRoutes from '../routes/userRoutes'
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

// Public routes
router.use('/api/config', validatePayload, setRateLimit(100), configRoutes);
router.use('/api/assets', validatePayload, setRateLimit(100), assetsRoutes);
router.use('/api/auth', setRateLimit(100), authRoutes)

// Protected routes
router.use('/api/user', authenticateToken, setRateLimit(100), userRoutes)

// Broker routes (requires x-broker-api-key)
router.use('/api/broker', validatePayload, setRateLimit(100), validateBrokerApiKey, brokerRoutes)

export default router;
