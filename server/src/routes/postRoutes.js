import { Router } from 'express';
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  getExplore,
  getFeed,
  getPost,
  getSavedPosts,
  toggleLike,
  toggleSave,
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();
router.use(protect);
router.get('/feed', getFeed);
router.get('/explore', getExplore);
router.get('/saved', getSavedPosts);
router.get('/:postId', getPost);
router.post('/', upload.single('image'), createPost);
router.post('/:postId/like', toggleLike);
router.post('/:postId/save', toggleSave);
router.post('/:postId/comments', addComment);
router.delete('/:postId/comments/:commentId', deleteComment);
router.delete('/:postId', deletePost);
export default router;
