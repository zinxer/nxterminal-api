import express from 'express';
import { getKlines } from '../controllers/marketDataController';
import { validateMandatoryParams } from '../middleware/validationMiddleware';

const router = express.Router();

// Define routes
router.get('/klines', validateMandatoryParams(['symbol', 'interval']), getKlines)

export default router;
