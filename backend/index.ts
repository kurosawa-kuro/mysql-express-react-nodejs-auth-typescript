import path from 'path';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import { userRoutes } from './routes/userRoutes';

dotenv.config();

export const app: Express = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/users', userRoutes);

// Static files and default route
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req: Request, res: Response) => {
        res.send('API is running....');
    });
}

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
