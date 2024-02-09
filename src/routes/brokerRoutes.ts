import express from 'express';
import { createUser, getUser } from '../controllers/brokerController';
import { validateMandatoryParams } from '../middleware/validationMiddleware';

const router = express.Router();

// Define GET routes
router.post('/user', createUser)
//TODO: router.post('/user/reset', resetUserPassword)

// Define POST routes
router.get('/user', getUser)


export default router;
