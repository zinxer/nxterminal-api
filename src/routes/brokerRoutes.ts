import express from 'express';
import { createUser, getUser } from '../controllers/brokerController';
import { validateMandatoryParams } from '../middleware/validationMiddleware';

const router = express.Router();

// Define POST routes
router.post('/user', createUser)
//TODO: router.post('/user/reset', resetUserPassword)

// Define GET routes
router.get('/user/:userId', getUser)


export default router;
