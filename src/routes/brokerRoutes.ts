import express from 'express';
import { createUser, getUser, resetUserPassword } from '../controllers/brokerController';
import { validateMandatoryParams } from '../middleware/validationMiddleware';

const router = express.Router();

// Define POST routes
router.post('/user', createUser)
router.post('/user/:userId/reset', validateMandatoryParams(['userId']), resetUserPassword)

// Define GET routes
router.get('/user/:userId', getUser)


export default router;