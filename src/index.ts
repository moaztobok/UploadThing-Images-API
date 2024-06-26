import express from 'express'
const app = express();
const PORT = 3000;
import galleryRouter from './routes/gallery';
app.use('/api/gallery', galleryRouter)
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});
