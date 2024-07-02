import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import uploadThingRouter from './routes/uploadthing'
const app = express();
const PORT = 3000;
import galleryRouter from './routes/gallery';
app.use('/api/gallery', galleryRouter)
app.use('/api/uploadthing',uploadThingRouter)
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});
