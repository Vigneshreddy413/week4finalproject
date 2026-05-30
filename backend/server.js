import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Import Route Handlers
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Import Error Handler
import { errorHandler } from './middleware/errorMiddleware.js';

// Load env vars
dotenv.config();

// Establish DB Connection
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: '*', // Allow all origins for dynamic portfolio showcases
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Simple Health Check/Welcome Route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'EduAI API Server is healthy and running.',
    timestamp: new Date()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/users', userRoutes);

// Mount Global Error Handling Middleware
app.use(errorHandler);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend build static files on the same server
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback to index.html for React routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] EduAI API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err, promise) => {
  console.error(`[Server Error] Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
