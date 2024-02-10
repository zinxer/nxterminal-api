import express from 'express';
import { loginUser, refreshToken } from '../controllers/authController';
import { validateMandatoryParams } from '../middleware/validationMiddleware';

const router = express.Router();

// Define POST routes
router.post('/login', validateMandatoryParams(['userId', 'password']), loginUser)
router.post('/token',validateMandatoryParams(['refreshToken']), refreshToken)

// Define GET routes
//router.get('/user/:userId', getUser)


export default router;
