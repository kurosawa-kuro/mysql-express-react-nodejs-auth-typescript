// backend\index.ts

import path from 'path';
import express, { Express, Request, Response } from 'express';
import cors, { CorsOptions } from "cors";
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import { router as userRoutes } from './routes/userRoutes';

export const app: Express = express();

const corsOptions: CorsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/users', userRoutes);

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    app.get('*', (req: Request, res: Response) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
} else {
    app.get('/', (req: Request, res: Response) => {
        res.send('API is running....');
    });
}

app.get('/', (req: Request, res: Response) => {
    res.send('API is running....');
});

app.use(notFound);
app.use(errorHandler);

