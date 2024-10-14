import { Router } from "express";
import { createBlog, deleteBlogById, getAllBlogs, getBlogById } from "../controllers/blog";
import { upload } from "../config/multer";
import { authenticateJWT } from "../config/auth";

const router = Router();

router.post('/', upload.array('files'), createBlog);
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.delete('/:id', deleteBlogById);
export default router