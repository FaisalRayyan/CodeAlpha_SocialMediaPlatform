import { Router } from 'express';
import { getUserProfile, searchUsers, toggleFollow, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();
router.get('/search', protect, searchUsers);
router.get('/:username', protect, getUserProfile);
router.patch('/me', protect, upload.single('avatar'), updateProfile);
router.post('/:userId/follow', protect, toggleFollow);
export default router;
