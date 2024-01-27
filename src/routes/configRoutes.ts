import express from 'express';
import { getSetupConfig } from '../controllers/configController';
import { validateMandatoryParams } from '../middleware/validationMiddleware';

const router = express.Router();

// Define routes
router.get('/setup', getSetupConfig)

export default router;
