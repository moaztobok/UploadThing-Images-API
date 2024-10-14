import { run } from './config/app'
import express from 'express'
import galleryRouter from './routes/gallery';
import blogRouter from './routes/blog';
import loginRouter from './routes/auth';
export const app = express();
app.use(express.json());

run();

const PORT = process.env.PORT;


app.use('/api/gallery/', galleryRouter)
app.use('/api/blog', blogRouter)
// app.use('/api/login', loginRouter)
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
});
