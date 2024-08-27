import mongoose, { Schema } from 'mongoose';

const blogSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrls: { type: [String], required: true },
    uploadDate: { type: Date, default: Date.now },
})
export default mongoose.model('Blog', blogSchema); 