import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import progressRoutes from './routes/progress.js';
import './firebase.js';

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

const PORT = 3007;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Backend running on http://0.0.0.0:${PORT}`);
  console.log(`   Health: GET http://0.0.0.0:${PORT}/health`);
  console.log(`   Save:   POST http://0.0.0.0:${PORT}/api/progress/save`);
  console.log(`   Load:   GET http://0.0.0.0:${PORT}/api/progress/load\n`);
});
