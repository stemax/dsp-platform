import express, {type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';

import rtbRoutes from './routes/rtb';
import callbackRoutes from './routes/callback';
import authController from "./controllers/authController.ts";
import dotenv from "dotenv";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1,
    message: 'Too many requests, please try again later.',
});
app.use('/', limiter);

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Simple DSP Platform');
});

app.post('/register', authController.register);
app.post('/login', authController.login);

app.use('/api/rtb', rtbRoutes);
app.use('/api/callback', callbackRoutes);

// Connect to DB
export const prisma = new PrismaClient();

await prisma.$connect().then(
    () => {
        console.info('Connected to Prisma DB');
    },
    (error) => {
        console.error('Error connecting to DB:', error);
    }
)

// Start server
const PORT = dotenv.config()?.parsed?.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
