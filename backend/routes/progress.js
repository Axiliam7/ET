import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

const router = express.Router();

// POST /save: Save or update user progress
router.post('/save', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { data } = req.body;
  try {
    const updated = await Progress.findOneAndUpdate(
      { user: userId },
      { $set: { 'progress.data': data } },
      { upsert: true, new: true }
    );
    await User.findOneAndUpdate(
      { _id: userId },
      { lastUpdated: new Date() },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Progress saved successfully.', progress: updated.progress });
  } catch (error) {
    console.error('Error saving progress:', error.message);
    res.status(500).json({ message: 'Error saving progress', error: error.message });
  }
});

// GET /load: Load user progress or create empty record
router.get('/load', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const doc = await Progress.findOne({ user: userId });
    const progress = doc ? doc.progress : { data: {} };
    res.status(200).json({ progress });
  } catch (error) {
    console.error('Error loading progress:', error.message);
    res.status(500).json({ message: 'Error loading progress', error: error.message });
  }
});

// GET /user: Retrieve user profile info
router.get('/user', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error retrieving user:', error.message);
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
});

export default router;