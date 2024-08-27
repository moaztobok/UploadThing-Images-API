import { Request, Response } from 'express';
import { UTApi } from 'uploadthing/server';
import blogModal from '../models/blogModal';

export const utapi = new UTApi({
    apiKey: process.env.UPLOADTHING_SECRET
});

export const createBlog = async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }

    try {
        const fileObjects = (req.files as Express.Multer.File[]).map(file =>
            new File([file.buffer], file.originalname, { type: file.mimetype })
        );

        const uploadedFiles = await utapi.uploadFiles(fileObjects);
        console.log("Uploaded files:", uploadedFiles);
        const imageUrls = uploadedFiles.map(file => file.data?.url);
        console.log("Image URLs:", imageUrls);
        const newBlog = new blogModal({
            title: req.body.title,
            imageUrls: imageUrls,
            description: req.body.description,
            uploadDate: new Date(),
        });
        const savedBlog = await newBlog.save();

        console.log("Blog created:", savedBlog);

        res.json({
            message: 'blog uploaded successfully',
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed', message: error.message });
    }
}

// Get all blogs
export const getAllBlogs = async (req: Request, res: Response) => {
    try {
        const blogs = await blogModal.find();
        res.json(blogs);
    } catch (error: any) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ error: "Failed to fetch blogs", message: error.message });
    }
};

// Get a single blog by ID
export const getBlogById = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    try {
        const blog = await blogModal.findById(blogId);

        if (!blog) {
            return res.status(404).json({ error: "blog not found" });
        }
        res.json(blog);
    } catch (error: any) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ error: "Failed to fetch blog", message: error.message });
    }
};
// Delete a blog by ID
export const deleteBlogById = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    try {
        const deletedBlog = await blogModal.findByIdAndDelete(blogId);
        res.json(deletedBlog);
    }
    catch (error: any) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ error: "Failed to delete blog", message: error.message });
    }
};