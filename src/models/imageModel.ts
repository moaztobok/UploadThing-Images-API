import mongoose, { Schema, Document } from 'mongoose';

export interface ImageDocument extends Document {
  imageUrl: string;
  imageType: 'artwork' | 'photograph';
  title: string;
  description?: string;
  uploadDate: Date;
  userId: string;
}

const ImageSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  imageType: { type: String, enum: ['artwork', 'photograph'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  uploadDate: { type: Date, default: Date.now },
  userId: { type: String, required: true }
});

export default mongoose.model<ImageDocument>('Image', ImageSchema);