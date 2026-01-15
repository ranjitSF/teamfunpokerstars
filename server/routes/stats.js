import express from 'express';
import pool from '../database/db.js';
import { verifyToken } from '../config/firebase.js';

const router = express.Router();

// Get overall leaderboard
router.get('/leaderboard', verifyToken, async (req, res) => {
  try {
    const { year } = req.query;

    let query;
    const params = [];

    if (year) {
      query = `
        SELECT * FROM yearly_stats
        WHERE year = $1
        ORDER BY total_points DESC, avg_position ASC
      `;
      params.push(year);
    } else {
      query = `
        SELECT * FROM player_stats
        ORDER BY total_points DESC, avg_position ASC
      `;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get head-to-head statistics between two players
router.get('/head-to-head/:player1/:player2', verifyToken, async (req, res) => {
  try {
    const { player1, player2 } = req.params;

    const result = await pool.query(
      `SELECT
        g.id as game_id,
        g.game_date,
        gr1.position as player1_position,
        gr1.points as player1_points,
        gr2.position as player2_position,
        gr2.points as player2_points
      FROM games g
      JOIN game_results gr1 ON g.id = gr1.game_id AND gr1.player_id = $1 AND gr1.attended = true
      JOIN game_results gr2 ON g.id = gr2.game_id AND gr2.player_id = $2 AND gr2.attended = true
      ORDER BY g.game_date DESC`,
      [player1, player2]
    );

    const games = result.rows;
    const player1Wins = games.filter(g => g.player1_position < g.player2_position).length;
    const player2Wins = games.filter(g => g.player2_position < g.player1_position).length;

    res.json({
      games,
      totalGames: games.length,
      player1Wins,
      player2Wins,
      player1AvgPosition: games.length > 0 ? games.reduce((sum, g) => sum + g.player1_position, 0) / games.length : 0,
      player2AvgPosition: games.length > 0 ? games.reduce((sum, g) => sum + g.player2_position, 0) / games.length : 0,
    });
  } catch (error) {
    console.error('Error fetching head-to-head:', error);
    res.status(500).json({ error: 'Failed to fetch head-to-head stats' });
  }
});

// Get recent form (last 5 games)
router.get('/recent-form/:playerId', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        g.game_date,
        gr.position,
        gr.points
      FROM game_results gr
      JOIN games g ON gr.game_id = g.id
      WHERE gr.player_id = $1 AND gr.attended = true
      ORDER BY g.game_date DESC
      LIMIT 5`,
      [req.params.playerId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching recent form:', error);
    res.status(500).json({ error: 'Failed to fetch recent form' });
  }
});

// Get monthly statistics
router.get('/monthly', verifyToken, async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();

    const result = await pool.query(
      `SELECT
        EXTRACT(MONTH FROM g.game_date) as month,
        COUNT(DISTINCT g.id) as games_played,
        AVG(subq.player_count) as avg_players
      FROM games g
      JOIN (
        SELECT game_id, COUNT(*) as player_count
        FROM game_results
        WHERE attended = true
        GROUP BY game_id
      ) subq ON g.id = subq.game_id
      WHERE EXTRACT(YEAR FROM g.game_date) = $1
      GROUP BY EXTRACT(MONTH FROM g.game_date)
      ORDER BY month`,
      [currentYear]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    res.status(500).json({ error: 'Failed to fetch monthly stats' });
  }
});

// Get attendance statistics
router.get('/attendance', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        p.id,
        p.name,
        COUNT(DISTINCT g.id) as total_games,
        COUNT(DISTINCT gr.game_id) as attended_games,
        ROUND(COUNT(DISTINCT gr.game_id)::numeric / NULLIF(COUNT(DISTINCT g.id), 0) * 100, 1) as attendance_rate
      FROM players p
      CROSS JOIN games g
      LEFT JOIN game_results gr ON p.id = gr.player_id AND g.id = gr.game_id AND gr.attended = true
      WHERE p.is_active = true
      GROUP BY p.id, p.name
      ORDER BY attendance_rate DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ error: 'Failed to fetch attendance stats' });
  }
});

// Get streaks (winning streaks, podium streaks, etc.)
router.get('/streaks/:playerId', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `WITH player_games AS (
        SELECT
          g.game_date,
          gr.position,
          ROW_NUMBER() OVER (ORDER BY g.game_date) as game_num
        FROM game_results gr
        JOIN games g ON gr.game_id = g.id
        WHERE gr.player_id = $1 AND gr.attended = true
        ORDER BY g.game_date
      )
      SELECT
        position,
        game_date,
        game_num
      FROM player_games
      ORDER BY game_date DESC`,
      [req.params.playerId]
    );

    // Calculate current streaks
    const games = result.rows;
    let currentWinStreak = 0;
    let currentPodiumStreak = 0;

    for (const game of games) {
      if (game.position === 1) {
        currentWinStreak++;
      } else {
        break;
      }
    }

    for (const game of games) {
      if (game.position <= 3) {
        currentPodiumStreak++;
      } else {
        break;
      }
    }

    res.json({
      currentWinStreak,
      currentPodiumStreak,
      recentGames: games.slice(0, 10),
    });
  } catch (error) {
    console.error('Error fetching streaks:', error);
    res.status(500).json({ error: 'Failed to fetch streaks' });
  }
});

export default router;
