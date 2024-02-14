import express from 'express';
import { changePassword, getUser, setTheme, setWatchlist } from '../controllers/userController';
import { validateMandatoryParams, validatePayload } from '../middleware/validationMiddleware';

const router = express.Router();

// Define GET routes
router.get('/', validatePayload, getUser)

// Define POST routes
router.post('/password', validateMandatoryParams(['currentPassword', 'newPassword']), changePassword)


// User settings routes
router.post('/setting/theme/:theme', setTheme)
router.post('/setting/watchlist', validateMandatoryParams(['symbols']), setWatchlist)


export default router;
