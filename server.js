// server.js — unified single-container Express server
import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

// ── Auth middleware ────────────────────────────────────────────────────────────
// Extracts JWT from ?token query param OR Authorization header.
// If JWT_SECRET is set: verifies the token (HS256).
// If JWT_SECRET is absent: decodes without verification and logs a warning.
// Attaches req.studentId, req.sessionId, req.userId when present in the payload.
// Returns 401 on missing/invalid token (unless JWT_SECRET is absent).
function authMiddleware(req, res, next) {
  const token = req.query.token || req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  let decoded;
  if (process.env.JWT_SECRET) {
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } else {
    console.warn('WARNING: JWT_SECRET is not set — token is decoded without verification');
    decoded = jwt.decode(token) || {};
  }

  if (decoded.studentId !== undefined) req.studentId = decoded.studentId;
  if (decoded.sessionId !== undefined) req.sessionId = decoded.sessionId;
  if (decoded.userId !== undefined) req.userId = decoded.userId;

  // Store token for downstream use (e.g. forwarding to upstream services)
  req._token = token;

  next();
}

// ── Rate limiters ─────────────────────────────────────────────────────────────
const recommendLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// ── API routes (/api/*) ────────────────────────────────────────────────────────

// POST /api/recommend/forward
// Forwards the request body to the upstream recommendation service.
app.post('/api/recommend/forward', recommendLimiter, authMiddleware, async (req, res) => {
  const upstream = 'https://kaushik-dev.online/api/recommend/';
  try {
    const response = await fetch(upstream, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req._token}`,
      },
      body: JSON.stringify(req.body),
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    res.status(response.status).send(data);
  } catch (err) {
    console.error('Failed to forward to upstream:', err.message);
    res.status(502).json({ error: 'Failed to reach recommendation service' });
  }
});

// ── Static files & SPA fallback ───────────────────────────────────────────────
const distDir = join(__dirname, 'dist');

app.use(express.static(distDir));

// All unmatched routes return the React app's index.html (supports React Router)
app.get('/{*path}', (req, res) => {
  res.sendFile(join(distDir, 'index.html'));
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = 3007;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`   Static files served from: ${distDir}`);
  console.log(`   API: POST http://0.0.0.0:${PORT}/api/recommend/forward\n`);
});

