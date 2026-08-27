import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { changePassword, login, me, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 40, standardHeaders: true, legacyHeaders: false });

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, me);
router.patch('/password', protect, changePassword);
export default router;
