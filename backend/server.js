import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { requestLogger } from './middleware/logging.js';
import progressRoutes from './routes/progress.js';

dotenv.config();

const app = express();

// ── Middleware ───────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);

app.use(express.json());
app.use(requestLogger);

// ── Routes ───────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/progress', progressRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({ error: 'Internal server error' });
});

// ── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3007;

let server;

async function start() {
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`\n🚀 Backend running on http://localhost:${PORT}`);
    console.log(`   Health: GET  http://localhost:${PORT}/health`);
    console.log(`   Save:   POST http://localhost:${PORT}/api/progress/save`);
    console.log(`   Load:   GET  http://localhost:${PORT}/api/progress/load?userId=...\n`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});

export { app, server };
