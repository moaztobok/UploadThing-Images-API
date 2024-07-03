import { Request, Response } from "express"
import Image from "../models/imageModel"
export const getImages = async (req: Request, res: Response) => {
  try {
      const { imageType } = req.query;
      let query = {};
      if (imageType) {
          query = { imageType };
      }
      const images = await Image.find(query);
      res.json(images);
  } catch (error:any) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: 'Failed to fetch images', message: error.message });
  }
}