import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import { connectToDatabase } from './config/db';
connectToDatabase();

const app = express();
const PORT = 5000;
import galleryRouter from './routes/gallery';
app.use('/api/gallery', galleryRouter)
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});
