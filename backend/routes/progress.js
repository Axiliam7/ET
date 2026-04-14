import express from 'express';
import rateLimit from 'express-rate-limit';
import Progress from '../models/Progress.js';

const router = express.Router();

// Rate limiter: max 60 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

router.use(limiter);

/**
 * Ensure a value is a non-empty string to prevent NoSQL injection.
 */
function isValidString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * POST /api/progress/save
 * Body: { userId: string, learnerState: object }
 * Upserts the learner state document for the given userId.
 */
router.post('/save', async (req, res) => {
  const { userId, learnerState } = req.body;

  // Explicit type guard before string validation to prevent NoSQL injection
  if (typeof userId !== 'string' || !isValidString(userId)) {
    return res.status(400).json({ success: false, message: 'userId must be a non-empty string' });
  }

  if (learnerState === undefined || learnerState === null) {
    return res.status(400).json({ success: false, message: 'learnerState is required' });
  }

  try {
    await Progress.findOneAndUpdate(
      { userId: userId.trim() },
      { learnerState },
      { upsert: true, new: true, runValidators: true }
    );
    return res.status(200).json({ success: true, message: 'Progress saved' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    console.error('[progress/save] error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error while saving progress' });
  }
});

/**
 * GET /api/progress/load?userId=...
 * Returns the stored learnerState for the userId, or an empty default if not found.
 */
router.get('/load', async (req, res) => {
  const { userId } = req.query;

  // Explicit type guard: query params can be arrays/objects (e.g. ?userId[]=val)
  if (typeof userId !== 'string' || !isValidString(userId)) {
    return res.status(400).json({ success: false, message: 'userId must be a non-empty string' });
  }

  try {
    const doc = await Progress.findOne({ userId: userId.trim() });

    if (!doc) {
      return res.status(200).json({ learnerState: {} });
    }

    return res.status(200).json({ learnerState: doc.learnerState });
  } catch (err) {
    console.error('[progress/load] error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error while loading progress' });
  }
});

export default router;