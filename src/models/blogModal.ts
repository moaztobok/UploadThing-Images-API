import mongoose, { Schema, Document } from 'mongoose';

interface IBlog extends Document {
    title: string;
    description: string;
    content: string;
    author: string;
    imageUrls: string[];
    tags: [];
    category: 'Graphic Design' | 'Photography' | 'Web Development';
    lastModified: Date;
}
const blogSchema: Schema = new Schema({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    content: { type: String, required: true },
    author: { type: String, required: true },
    imageUrls: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    category: {
        type: String,
        required: true,
        enum: ['Graphic Design', 'Photography', 'Web Development']
    }, uploadDate: { type: Date, default: Date.now },
}, {
    timestamps: true
});

blogSchema.index({ title: 'text', description: 'text', content: 'text' });

export default mongoose.model<IBlog>('Blog', blogSchema);