import { Request, Response } from 'express';
import { UTApi } from 'uploadthing/server';

export const utapi = new UTApi({
    apiKey: process.env.UPLOADTHING_SECRET
});

export const uploadImages = async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }

    try {
        const fileObjects = (req.files as Express.Multer.File[]).map(file => 
            new File([file.buffer], file.originalname, { type: file.mimetype })
        );

        const uploadedFiles = await utapi.uploadFiles(fileObjects, {
            metadata: { userId: 'Moaz Tobok' }
        });

        console.log(`Upload completed for userId: Moaz Tobok`);
        console.log("Files URLs:", uploadedFiles.map(file => file.data));

        res.json({
            message: 'Files uploaded successfully',
            files: uploadedFiles
        });
    } catch (error:any) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed', message: error.message });
    }
}