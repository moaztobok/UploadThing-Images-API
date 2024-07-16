import { run } from './config/app'
import express from 'express'
export const app = express();
import galleryRouter from './routes/gallery';

run();

const PORT = process.env.PORT;


app.use('/api/gallery/', galleryRouter)

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
});
