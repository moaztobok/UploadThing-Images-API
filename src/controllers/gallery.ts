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
export const getImageById = async (req: Request, res: Response) => {
    const imageId = req.params.id;

    try {
        const image = await Image.findById(imageId);

        if (!image) {
            return res.status(404).json({ error: "Image not found" });
        }

        res.json(image);
    } catch (error: any) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Failed to fetch image', message: error.message });
    }
};
