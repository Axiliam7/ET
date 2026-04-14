import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import progressRoutes from './routes/progress.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

const progressLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority',
};

const MAX_RETRIES = 5;
const RETRY_BASE_MS = 5000;

let retryTimer = null;

const connectDB = async (attempt = 1) => {
  if (!process.env.MONGODB_URI) {
    console.error('✗ MONGODB_URI environment variable is not set. Cannot connect to MongoDB.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, MONGO_OPTIONS);
    console.log('✓ Connected to MongoDB');
  } catch (err) {
    console.error(`✗ MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`);
    if (attempt < MAX_RETRIES) {
      const delay = Math.pow(2, attempt - 1) * RETRY_BASE_MS;
      console.log(`  Retrying in ${delay / 1000}s…`);
      retryTimer = setTimeout(() => connectDB(attempt + 1), delay);
    } else {
      console.error('  Max retries reached. Exiting.');
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠ MongoDB disconnected. Attempting to reconnect…');
  connectDB(1);
});

mongoose.connection.on('error', (err) => {
  console.error('✗ MongoDB connection error:', err.message);
});

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Closing server…`);
  if (retryTimer) clearTimeout(retryTimer);
  mongoose.connection.close().then(() => process.exit(0));
};
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

connectDB();

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/progress', progressLimiter, progressRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🚀 Backend running on http://localhost:${PORT}`);
  console.log(`   Health: GET http://localhost:${PORT}/health`);
  console.log(`   Save:   POST http://localhost:${PORT}/api/progress/save`);
  console.log(`   Load:   GET http://localhost:${PORT}/api/progress/load\n`);
});
