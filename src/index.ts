import { run } from './config/app'
import express from 'express'
export const app = express();
import galleryRouter from './routes/gallery';
import blogRouter from './routes/blog';
run();

const PORT = process.env.PORT;


app.use('/api/gallery/', galleryRouter)
app.use('/api/blog', blogRouter)
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
});
