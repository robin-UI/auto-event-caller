import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRouter';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3001', // your Next.js frontend
    credentials: true, // allow cookies to be sent
  }),
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
