import { Router } from "express";
import { getImages } from "../controllers/gallery";
const router = Router();

router.get('/', getImages);
export default router