import express from 'express';
import pool from '../database/db.js';
import { verifyToken } from '../config/firebase.js';
import { sendWelcomeEmail } from '../utils/email.js';

const router = express.Router();

// Admin email
const ADMIN_EMAIL = 'ranjit.jose.2012@gmail.com';

// Get all players
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, created_at, is_active FROM players WHERE is_active = true ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Get player by Firebase UID
router.get('/by-uid/:uid', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, firebase_uid, name, email, phone, created_at FROM players WHERE firebase_uid = $1',
      [req.params.uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

// Create or update player (used during authentication)
router.post('/sync', verifyToken, async (req, res) => {
  try {
    const { firebase_uid, email, name, phone } = req.body;

    // Check if player already exists
    const existingPlayer = await pool.query(
      'SELECT * FROM players WHERE firebase_uid = $1',
      [firebase_uid]
    );

    let player;
    if (existingPlayer.rows.length > 0) {
      // Update existing player
      const updateResult = await pool.query(
        'UPDATE players SET name = $1, phone = $2 WHERE firebase_uid = $3 RETURNING *',
        [name, phone, firebase_uid]
      );
      player = updateResult.rows[0];
    } else {
      // Check if email is in authorized list (you'll need to manage this)
      // For now, we'll allow any email to create an account
      const insertResult = await pool.query(
        'INSERT INTO players (firebase_uid, email, name, phone) VALUES ($1, $2, $3, $4) RETURNING *',
        [firebase_uid, email, name, phone]
      );
      player = insertResult.rows[0];

      // Send welcome email
      await sendWelcomeEmail({ email: player.email, name: player.name });
    }

    res.json(player);
  } catch (error) {
    console.error('Error syncing player:', error);
    res.status(500).json({ error: 'Failed to sync player' });
  }
});

// Add player (admin only) - sends magic link invitation
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if user is admin
    if (req.user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Only admins can add players' });
    }

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if player already exists
    const existingPlayer = await pool.query(
      'SELECT id, name, email FROM players WHERE email = $1',
      [email]
    );

    if (existingPlayer.rows.length > 0) {
      return res.status(409).json({ error: 'A player with this email already exists' });
    }

    // Create player with a temporary firebase_uid (will be updated when they sign in)
    const result = await pool.query(
      'INSERT INTO players (firebase_uid, email, name, is_active) VALUES ($1, $2, $3, true) RETURNING id, name, email, created_at',
      [`pending_${email}`, email, name]
    );

    const newPlayer = result.rows[0];

    // Send welcome email with magic link
    await sendWelcomeEmail({ email: newPlayer.email, name: newPlayer.name });

    res.status(201).json(newPlayer);
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({ error: 'Failed to add player' });
  }
});

// Get player statistics
router.get('/:id/stats', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM player_stats WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.json({
        games_played: 0,
        total_points: 0,
        avg_points: 0,
        avg_position: 0,
        first_place_finishes: 0,
        second_place_finishes: 0,
        third_place_finishes: 0,
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
});

// Get player yearly statistics
router.get('/:id/yearly-stats', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM yearly_stats WHERE player_id = $1 ORDER BY year DESC',
      [req.params.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching yearly stats:', error);
    res.status(500).json({ error: 'Failed to fetch yearly stats' });
  }
});

// Update player name (admin only)
router.patch('/:id/name', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const playerId = req.params.id;

    // Check if user is admin
    if (req.user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Only admins can update player names' });
    }

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await pool.query(
      'UPDATE players SET name = $1 WHERE id = $2 RETURNING id, name, email, phone, created_at',
      [name.trim(), playerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating player name:', error);
    res.status(500).json({ error: 'Failed to update player name' });
  }
});

// Get player game history
router.get('/:id/games', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        g.id, g.game_date, gr.position, gr.points, gr.attended,
        COUNT(gr2.id) FILTER (WHERE gr2.attended = true) as total_players
      FROM games g
      JOIN game_results gr ON g.id = gr.game_id
      LEFT JOIN game_results gr2 ON g.id = gr2.game_id
      WHERE gr.player_id = $1
      GROUP BY g.id, g.game_date, gr.position, gr.points, gr.attended
      ORDER BY g.game_date DESC`,
      [req.params.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching player games:', error);
    res.status(500).json({ error: 'Failed to fetch player games' });
  }
});

export default router;
