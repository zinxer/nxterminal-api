import express from 'express';
import { loginUser, logoutUser, refreshToken } from '../controllers/authController';
import { validateMandatoryParams } from '../middleware/validationMiddleware';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

// Define POST routes
router.post('/login', validateMandatoryParams(['userId', 'password']), loginUser)

router.post('/logout', authenticateToken, logoutUser)

router.post('/token',validateMandatoryParams(['refreshToken']), refreshToken)


export default router;
