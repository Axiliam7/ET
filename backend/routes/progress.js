import express from 'express';
import { admin, db } from '../firebase.js';

const router = express.Router();
// Restrict saveKey format/length to bound document IDs and avoid unsafe characters.
const SAVE_KEY_REGEX = /^[a-zA-Z0-9_-]+$/;
const MAX_SAVE_KEY_LENGTH = 100;

const isValidSaveKey = (saveKey) =>
  typeof saveKey === 'string' &&
  saveKey.length > 0 &&
  saveKey.length <= MAX_SAVE_KEY_LENGTH &&
  SAVE_KEY_REGEX.test(saveKey);

// POST /save: Save or update progress by saveKey
router.post('/save', async (req, res) => {
  const { saveKey, data } = req.body || {};
  if (!isValidSaveKey(saveKey)) {
    return res.status(400).json({ ok: false, error: "Invalid 'saveKey'" });
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return res.status(400).json({ ok: false, error: "Missing or invalid 'data' field" });
  }

  try {
    await db.collection('progress').doc(saveKey).set({
      saveKey,
      data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.status(200).json({ ok: true, data });
  } catch (error) {
    console.error('Error saving progress:', error.message);
    return res.status(500).json({ ok: false, error: error.message });
  }
});

// GET /load: Load progress by saveKey
router.get('/load', async (req, res) => {
  const saveKey = req.query.saveKey;
  if (!isValidSaveKey(saveKey)) {
    return res.status(400).json({ ok: false, error: "Invalid 'saveKey'" });
  }

  try {
    const doc = await db.collection('progress').doc(saveKey).get();
    if (!doc.exists) {
      return res.status(404).json({ ok: false, error: 'Progress data not found for the provided saveKey' });
    }

    const progress = doc.data();
    return res.status(200).json({ ok: true, data: progress.data });
  } catch (error) {
    console.error('Error loading progress:', error.message);
    return res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
