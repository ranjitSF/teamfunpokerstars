import express from 'express';
import pool from '../database/db.js';
import { verifyToken } from '../config/firebase.js';
import { calculateGamePoints } from '../utils/points.js';
import { formatInTimeZone } from 'date-fns-tz';
import { isValidDate, isPositiveInteger, validateGameResults, sanitizeString } from '../utils/validation.js';

const router = express.Router();

// Get all games
router.get('/', verifyToken, async (req, res) => {
  try {
    const { year } = req.query;

    // Validate year if provided
    if (year && !isPositiveInteger(year)) {
      return res.status(400).json({ error: 'Invalid year parameter' });
    }

    let query = `
      SELECT
        g.*,
        p.name as creator_name,
        COUNT(gr.id) FILTER (WHERE gr.attended = true) as player_count
      FROM games g
      LEFT JOIN players p ON g.created_by = p.id
      LEFT JOIN game_results gr ON g.id = gr.game_id
    `;

    const params = [];
    if (year) {
      query += ' WHERE EXTRACT(YEAR FROM g.game_date) = $1';
      params.push(parseInt(year, 10));
    }

    query += ' GROUP BY g.id, p.name ORDER BY g.game_date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Get single game with results
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const gameResult = await pool.query('SELECT * FROM games WHERE id = $1', [req.params.id]);

    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const resultsQuery = await pool.query(
      `SELECT
        gr.*,
        p.name as player_name,
        p.email as player_email
      FROM game_results gr
      JOIN players p ON gr.player_id = p.id
      WHERE gr.game_id = $1
      ORDER BY gr.position`,
      [req.params.id]
    );

    res.json({
      game: gameResult.rows[0],
      results: resultsQuery.rows,
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

// Create a new game
router.post('/', verifyToken, async (req, res) => {
  const { game_date, notes, created_by_uid } = req.body;

  // Validate required fields
  if (!created_by_uid) {
    return res.status(400).json({ error: 'Creator UID is required' });
  }
  if (!isValidDate(game_date)) {
    return res.status(400).json({ error: 'Valid game date is required' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get player ID from Firebase UID
    const playerResult = await client.query(
      'SELECT id FROM players WHERE firebase_uid = $1',
      [created_by_uid]
    );

    if (playerResult.rows.length === 0) {
      throw new Error('Player not found');
    }

    const created_by = playerResult.rows[0].id;

    // Convert date to PST timezone
    const pstDate = formatInTimeZone(new Date(game_date), 'America/Los_Angeles', 'yyyy-MM-dd HH:mm:ssXXX');

    const gameResult = await client.query(
      'INSERT INTO games (created_by, game_date, notes) VALUES ($1, $2, $3) RETURNING *',
      [created_by, pstDate, notes]
    );

    await client.query('COMMIT');
    res.json(gameResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  } finally {
    client.release();
  }
});

// Update game results (positions)
router.put('/:id/results', verifyToken, async (req, res) => {
  const { results } = req.body; // Array of {player_id, position, attended}

  // Validate game ID
  if (!isPositiveInteger(req.params.id)) {
    return res.status(400).json({ error: 'Invalid game ID' });
  }

  // Validate results
  const validation = validateGameResults(results);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Delete existing results
    await client.query('DELETE FROM game_results WHERE game_id = $1', [req.params.id]);

    // Calculate points
    const resultsWithPoints = calculateGamePoints(results);

    // Insert new results
    const insertPromises = resultsWithPoints.map((result) =>
      client.query(
        'INSERT INTO game_results (game_id, player_id, position, points, attended) VALUES ($1, $2, $3, $4, $5)',
        [req.params.id, result.player_id, result.position, result.points, result.attended]
      )
    );

    await Promise.all(insertPromises);

    // Mark game as finalized
    await client.query(
      'UPDATE games SET positions_finalized = true WHERE id = $1',
      [req.params.id]
    );

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating game results:', error);
    res.status(500).json({ error: 'Failed to update game results' });
  } finally {
    client.release();
  }
});

// Delete game
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM games WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

export default router;
