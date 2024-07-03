import { Router } from "express";
import { getImages,getImageById } from "../controllers/gallery";
import { deleteImage } from "../controllers/uploadthing";
const router = Router();

router.get('/', getImages);
router.get('/:id', getImageById);
router.delete('/:id', deleteImage);

export default router