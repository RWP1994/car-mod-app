import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';


const router = express.Router();

// 🆕 Create a new build
// Protect all routes below
router.use(auth);

// ✅ Now all routes require valid token

router.post('/', async (req, res) => {
  const { name, car_model, config } = req.body;

  const user_id = req.user.id; // grab user from token
  if (!name || !car_model)
    return res.status(400).json({ message: 'Missing required fields' });

  try {
    const [build] = await db('builds')
      .insert({ user_id, name, car_model, config: JSON.stringify(config) })
      .returning('*');

    res.status(201).json({ message: 'Build saved', build });
  } catch (err) {
    res.status(500).json({ message: 'Error saving build', error: err.message });
  }
});

router.get('/', async (req, res) => {
  const user_id = req.user.id;

  try {
    const builds = await db('builds').where({ user_id });
    res.status(200).json({ builds });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching builds', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;

  try {
    const build = await db('builds').where({ id }).first();

    if (!build || build.user_id !== user_id)
      return res.status(403).json({ message: 'Unauthorized to delete this build' });

    await db('builds').where({ id }).del();
    res.status(200).json({ message: 'Build deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting build', error: err.message });
  }
});


// 📦 Get all builds for a user
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const builds = await db('builds').where({ user_id });
    res.status(200).json({ builds });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching builds', error: err.message });
  }
});

export default router;
