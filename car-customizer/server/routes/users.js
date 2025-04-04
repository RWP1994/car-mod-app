import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// --- REGISTER ---
router.post('/register', async (req, res) => {
  const { username, password, bio } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const existingUser = await db('users').where({ username }).first();
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db('users')
      .insert({
        username,
        password: hashedPassword,
        bio,
        avatarUrl: '',
        garage: JSON.stringify([]),
      })
      .returning(['id', 'username', 'bio', 'avatarUrl', 'garage']);

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: '7d',
    });

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db('users').where({ username }).first();
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

export default router;
