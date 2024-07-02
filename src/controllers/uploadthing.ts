import { Request, Response } from 'express';
import { UTApi } from 'uploadthing/server';
export const utapi = new UTApi({
    apiKey: process.env.UPLOADTHING_SECRET
});
export const uploadImage = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    try {
        const file = req.file;
        const fileObject = new File([file.buffer], file.originalname, { type: file.mimetype });

        const uploadedFiles = await utapi.uploadFiles([fileObject], {
            metadata: { userId: 'Moaz Tobok' }
        });

        console.log("Upload completed for userId: Moaz Tobok");
        console.log("File URL:", uploadedFiles[0].data);

        res.json({
            message: 'File uploaded successfully',
            file: uploadedFiles[0]
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
}