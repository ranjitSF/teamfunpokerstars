import cron from 'node-cron';
import pool from '../database/db.js';
import { sendGameReminderEmail } from '../utils/email.js';

/**
 * Check for games that need reminder emails
 * Runs every hour and checks for games that:
 * 1. Occurred more than 24 hours ago
 * 2. Don't have finalized positions
 * 3. Haven't had a reminder sent yet
 */
export const checkForReminders = async () => {
  try {
    console.log('Checking for games needing reminders...');

    const result = await pool.query(
      `SELECT
        g.id,
        g.game_date,
        ARRAY_AGG(
          json_build_object(
            'email', p.email,
            'name', p.name
          )
        ) as players
      FROM games g
      JOIN game_results gr ON g.id = gr.game_id
      JOIN players p ON gr.player_id = p.id
      WHERE
        g.positions_finalized = false
        AND g.reminder_sent = false
        AND g.game_date < NOW() - INTERVAL '24 hours'
      GROUP BY g.id, g.game_date`
    );

    if (result.rows.length === 0) {
      console.log('No games need reminders');
      return;
    }

    console.log(`Found ${result.rows.length} game(s) needing reminders`);

    for (const game of result.rows) {
      const emailSent = await sendGameReminderEmail(game.players, game);

      if (emailSent) {
        await pool.query(
          'UPDATE games SET reminder_sent = true WHERE id = $1',
          [game.id]
        );
      }
    }
  } catch (error) {
    console.error('Error checking for reminders:', error);
  }
};

/**
 * Initialize the reminder cron job
 * Runs every hour
 */
export const initReminderJob = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    await checkForReminders();
  });

  console.log('✓ Reminder job scheduled (runs hourly)');
};
