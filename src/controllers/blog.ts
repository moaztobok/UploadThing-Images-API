import { Request, Response } from 'express';
import { UTApi } from 'uploadthing/server';
import blogModal from '../models/blogModal';
import sanitizeHtml from 'sanitize-html';

import moment from 'moment';
import sharp from 'sharp';
export const utapi = new UTApi({
    apiKey: process.env.UPLOADTHING_SECRET
});

export const createBlog = async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }

    try {
        const fileObjects = await Promise.all((req.files as Express.Multer.File[]).map(async file => {
            const metadata = await sharp(file.buffer).metadata();
            let orientation: 'landscape' | 'portrait' | 'square';
            if (metadata.width && metadata.height) {
                if (metadata.width > metadata.height) {
                    orientation = 'landscape';
                } else if (metadata.width < metadata.height) {
                    orientation = 'portrait';
                } else {
                    orientation = 'square';
                }
            } else {
                orientation = 'landscape'; // Default to landscape if dimensions can't be determined
            }
            return {
                file: new File([file.buffer], file.originalname, { type: file.mimetype }),
                orientation
            };
        }));

        const uploadedFiles = await utapi.uploadFiles(fileObjects.map(fo => fo.file));
        console.log("Uploaded files:", uploadedFiles);

        const images = uploadedFiles.map((file, index) => ({
            url: file.data?.url,
            orientation: fileObjects[index].orientation
        }));
        console.log("Images with orientation:", images);

        const sanitizedContent = sanitizeHtml(req.body.content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            allowedAttributes: {
                'a': ['href', 'name', 'target'],
                'img': ['src', 'alt'],
                'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
                'div': ['class', 'style'],
                'span': ['class', 'style'],
                'p': ['class', 'style'],
                'h1': ['class', 'style'],
                'h2': ['class', 'style'],
                'h3': ['class', 'style'],
                'h4': ['class', 'style'],
                'h5': ['class', 'style'],
                'h6': ['class', 'style'],
                'ul': ['class', 'style'],
                'ol': ['class', 'style'],
                'li': ['class', 'style'],
            },
        });

        const formattedDate = moment(req.body.lastModified || new Date()).format('dddd, DD MMM YYYY');

        const newBlog = new blogModal({
            title: req.body.title,
            images: images,
            content: sanitizedContent,
            tags: req.body.tags,
            category: req.body.category,
            author: req.body.author,
            description: req.body.description,
            lastModified: formattedDate,
        });

        const savedBlog = await newBlog.save();

        console.log("Blog created:", savedBlog);

        res.json({
            message: 'Blog uploaded successfully',
            blog: savedBlog
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