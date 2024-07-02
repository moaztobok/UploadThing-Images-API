import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadthing';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/', upload.single('image'), uploadImage);
    
export default router;