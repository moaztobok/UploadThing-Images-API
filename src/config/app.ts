import dotenv from 'dotenv';
import { connectToDatabase } from '../config/db';
import cors from 'cors'
import { app } from '..';
import helmet from 'helmet';

export const run = () => {
    app.use(cors());
    app.use(helmet());
    dotenv.config();
    connectToDatabase();
};