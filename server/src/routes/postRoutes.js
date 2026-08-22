import { Router } from 'express';
import { addComment, createPost, deletePost, getExplore, getFeed, toggleLike } from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();
router.use(protect);
router.get('/feed', getFeed);
router.get('/explore', getExplore);
router.post('/', upload.single('image'), createPost);
router.post('/:postId/like', toggleLike);
router.post('/:postId/comments', addComment);
router.delete('/:postId', deletePost);
export default router;
