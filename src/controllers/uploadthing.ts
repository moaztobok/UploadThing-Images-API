import { Request, Response } from 'express';
import { UTApi } from 'uploadthing/server';
import Image from '../models/imageModel';
import sharp from 'sharp';

export const utapi = new UTApi({
    apiKey: process.env.UPLOADTHING_SECRET
});
interface SuccessResult {
    fileName: string;
    imageUrl: string;
    id: string;
}

interface ErrorResult {
    fileName: string;
    error: string;
}
export const uploadImages = async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }

    const results: { successes: SuccessResult[], errors: ErrorResult[] } = {
        successes: [],
        errors: []
    };

    try {
        const compressedFiles = await Promise.all(
            (req.files as Express.Multer.File[]).map(async (file) => {
                try {
                    const metadata = await sharp(file.buffer).metadata();
                    const orientation = getOrientation(metadata);

                    const compressedBuffer = await sharp(file.buffer)
                        .resize({ width: 4096, height: 2160, fit: 'inside' })
                        .webp({ quality: 80 })
                        .toBuffer();

                    return {
                        file: new File([compressedBuffer], file.originalname.replace(/\.[^/.]+$/, ".webp"), {
                            type: 'image/webp'
                        }),
                        orientation
                    };
                } catch (error) {
                    results.errors.push({ fileName: file.originalname, error: `Compression failed: ${(error as Error).message}` });
                    return null;
                }
            })
        );

        const validCompressedFiles = compressedFiles.filter((cf): cf is NonNullable<typeof cf> => cf !== null);

        const uploadedFiles = await utapi.uploadFiles(validCompressedFiles.map(cf => cf.file), {
            metadata: { userId: 'Moaz Tobok' }
        });

        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            const compressedFile = validCompressedFiles[i];

            if (file.error) {
                results.errors.push({ fileName: compressedFile.file.name, error: `Upload failed: ${file.error.message}` });
                continue;
            }

            try {
                const newImage = new Image({
                    imageUrl: file.data?.url,
                    imageType: req.body.imageType || 'artwork',
                    title: file.data?.name || 'Untitled',
                    userId: 'Moaz Tobok',
                    orientation: compressedFile.orientation
                });

                const savedImage = await newImage.save() as { _id: string, imageUrl: string };
                results.successes.push({
                    fileName: file.data?.name || 'Unknown',
                    imageUrl: savedImage.imageUrl,
                    id: savedImage._id.toString()
                });
            } catch (error) {
                results.errors.push({ fileName: file.data?.name || 'Unknown', error: `Database save failed: ${(error as Error).message}` });
            }
        }

        console.log(`Upload completed for userId: Moaz Tobok`);
        console.log("Successfully uploaded files:", results.successes.map(s => s.fileName));

        if (results.errors.length > 0) {
            console.error("Errors occurred during upload:", results.errors);
            return res.status(207).json({
                message: 'Upload partially succeeded with some errors',
                results
            });
        } else {
            return res.json({
                message: 'All files uploaded and compressed successfully',
                results
            });
        }
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            error: 'Upload failed',
            message: (error as Error).message,
            results
        });
    }
}

function getOrientation(metadata: sharp.Metadata): string {
    if (metadata.width && metadata.height) {
        if (metadata.width > metadata.height) return 'landscape';
        if (metadata.width < metadata.height) return 'portrait';
        return 'square';
    }
    return 'unknown';
}
export const deleteImage = async (req: Request, res: Response) => {
    const imageId = req.params.id;

    try {
        // Find the image in the database
        const image = await Image.findById(imageId);

        if (!image) {
            return res.status(404).json({ error: "Image not found" });
        }

            // Extract the file key from the URL
            const fileKey = image.imageUrl.split('/').pop();

        if (!fileKey) {
            return res.status(400).json({ error: "Invalid image URL" });
        }

        // Delete the file from UploadThing
        await utapi.deleteFiles(fileKey);

        // Delete the image from the database
        await Image.findByIdAndDelete(imageId);

        res.json({ message: "Image deleted successfully" });
    } catch (error: any) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image', message: error.message });
    }
};