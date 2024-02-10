import express from 'express';
import { changePassword, getUser } from '../controllers/userController';
import { validateMandatoryParams } from '../middleware/validationMiddleware';

const router = express.Router();

// Define GET routes
router.get('/', getUser)

// Define POST routes
router.post('/password', validateMandatoryParams(['currentPassword', 'newPassword']), changePassword)


export default router;
