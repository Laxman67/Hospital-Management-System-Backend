import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { dbConnection } from './database/dbConnection.js';
import { errorMiddleware } from './middleware/errorHandler.js';
import messageRouter from './router/messageRouter.js';
import userRouter from './router/userRouter.js';
import appointmentRouter from './router/appointmentRouter.js';
const app = express();

// Config
config({
  path: './config/config.env',
});

// CORS

app.use(
  cors({
    origin: ['https://hospital-management-system-frontend-4b34.onrender.com','https://hospital-management-system-dashboard-n329.onrender.com'],
    // origin: ['http://localhost:5173', process.env.DASHBOARD_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to get form data

// Express File Upload Setup
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

// Routing

app.use('/api/v1/message', messageRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/appointment', appointmentRouter);

dbConnection();

// Error Middleware
app.use(errorMiddleware);

export default app;
