import dotenv from 'dotenv';
import { connectToDatabase } from '../config/db';
import express from 'express'
import cors from 'cors'


export const app = express();
export const run = () => {

    dotenv.config();
    connectToDatabase();
};