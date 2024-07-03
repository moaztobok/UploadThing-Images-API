import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for your document
interface IImage extends Document {
  imageUrl: string;
  imageType: 'artwork' | 'photograph';
  title: string;
  description?: string;
  uploadDate: Date;
  userId: string;
}

// Create the schema
const ImageSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  imageType: { type: String, enum: ['artwork', 'photograph'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  uploadDate: { type: Date, default: Date.now },
  userId: { type: String, required: true }
});

// Create and export the model
export default mongoose.model<IImage>('Image', ImageSchema);