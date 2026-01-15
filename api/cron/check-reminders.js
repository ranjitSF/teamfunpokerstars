// Vercel Cron Job handler for reminder emails
import { checkForReminders } from '../../server/jobs/reminders.js';

export default async function handler(req, res) {
  // Verify this is a cron request
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await checkForReminders();
    res.status(200).json({ success: true, message: 'Reminders checked' });
  } catch (error) {
    console.error('Error in cron job:', error);
    res.status(500).json({ error: 'Failed to check reminders' });
  }
}
