import { Router } from 'express';
import { ImageController } from '../controllers/imageController';

const router = Router();
const imageController = new ImageController();

router.get('/profile/:path',imageController.downloadImage);

export default router;
