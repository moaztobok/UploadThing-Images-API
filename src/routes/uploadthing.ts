import { Router } from 'express';
import multer from 'multer';
import { uploadImages } from '../controllers/uploadthing';

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 5MB limit (adjust as needed)
    }
  });
const router = Router();

router.post('/', upload.array('files'), uploadImages);
    
export default router;