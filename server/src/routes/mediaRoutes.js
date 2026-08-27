import { Router } from 'express';
import { getMedia } from '../controllers/mediaController.js';

const router = Router();
router.get('/:mediaId', getMedia);
export default router;
