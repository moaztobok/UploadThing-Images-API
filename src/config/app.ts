import dotenv from 'dotenv';
import { connectToDatabase } from '../config/db';
import cors from 'cors'
import { app } from '..';

export const run = () => {
    app.use(cors());
    dotenv.config();
    connectToDatabase();
};