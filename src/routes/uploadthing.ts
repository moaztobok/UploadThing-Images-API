import { Router } from 'express';
import { upload } from '../config/multer';
import { uploadImages } from '../controllers/uploadthing';


const router = Router();

router.post('/', upload.array('files'), uploadImages);
    
export default router;