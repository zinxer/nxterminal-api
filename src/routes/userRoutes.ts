import express from 'express';
import { changePassword, getUser } from '../controllers/userController';
import { validateMandatoryParams, validatePayload } from '../middleware/validationMiddleware';

const router = express.Router();

// Define GET routes
router.get('/', validatePayload, getUser)

// Define POST routes
router.post('/password', validateMandatoryParams(['currentPassword', 'newPassword']), changePassword)


export default router;
