import { Router } from 'express';
import multer from 'multer';
import { uploadImages } from '../controllers/uploadthing';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/', upload.array('files'), uploadImages);
    
export default router;