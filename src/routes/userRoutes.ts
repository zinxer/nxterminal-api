import express from 'express';
import { changePassword, getUser, setTheme } from '../controllers/userController';
import { validateMandatoryParams, validatePayload } from '../middleware/validationMiddleware';

const router = express.Router();

// Define GET routes
router.get('/', validatePayload, getUser)

// Define POST routes
router.post('/password', validateMandatoryParams(['currentPassword', 'newPassword']), changePassword)


// User settings routes
router.post('/setting/theme/:theme', setTheme)
//TODO: router.post('/setting/watchlist', validateMandatoryParams(['symbol'], setWatchlist))


export default router;
