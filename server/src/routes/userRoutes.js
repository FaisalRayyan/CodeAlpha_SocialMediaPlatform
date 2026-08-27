import { Router } from 'express';
import {
  getConnections,
  getSuggestions,
  getUserProfile,
  searchUsers,
  toggleFollow,
  updateProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();
router.use(protect);
router.get('/search', searchUsers);
router.get('/suggestions', getSuggestions);
router.patch('/me', upload.single('avatar'), updateProfile);
router.post('/:userId/follow', toggleFollow);
router.get('/:username/connections/:type', getConnections);
router.get('/:username', getUserProfile);
export default router;
