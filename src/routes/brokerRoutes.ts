import express from 'express';
import { createUser, getUser, resetUserPassword, getFinanceTxns } from '../controllers/brokerController';
import { validateMandatoryParams } from '../middleware/validationMiddleware';

const router = express.Router();

// User POST routes
router.post('/user', createUser)
router.post('/user/:userId/reset', validateMandatoryParams(['userId']), resetUserPassword)

// User GET routes
router.get('/user/:userId', validateMandatoryParams(['userId']), getUser)

// Finance Transaction GET routes
router.get('/transaction/finance/', getFinanceTxns)
router.get('/transaction/finance/:currency', getFinanceTxns)
router.get('/transaction/finance/:currency/:userId', getFinanceTxns)

// Transactions



export default router;