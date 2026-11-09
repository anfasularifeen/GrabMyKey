import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import propertyRoutes from './routes/propertyRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import presetRoutes from './routes/presetRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/grabmykey';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/presets', presetRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'GrabMyKey Real Estate MERN API',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Root API Welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to GrabMyKey Luxury Real Estate API (MERN Backend)',
    endpoints: {
      properties: '/api/properties',
      leads: '/api/leads',
      health: '/api/health'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Connect to MongoDB & Start Server
const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(` Connected to MongoDB at: ${MONGODB_URI.split('@').pop()}`);
  } catch (err) {
    console.warn(`⚠️ MongoDB connection warning: ${err.message}`);
    console.warn('ℹ️ Ensure MongoDB is running locally (mongod) or provide a valid MONGODB_URI in server/.env');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ GrabMyKey Express Backend active on http://0.0.0.0:${PORT} (Network: http://192.168.1.7:${PORT})`);
    console.log(`📡 Endpoints: http://192.168.1.7:${PORT}/api/properties | http://192.168.1.7:${PORT}/api/leads`);
  });
};

startServer();

export default app;
