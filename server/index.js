import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeFirebase } from './config/firebase.js';
import { initReminderJob } from './jobs/reminders.js';
import playersRouter from './routes/players.js';
import gamesRouter from './routes/games.js';
import statsRouter from './routes/stats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
initializeFirebase();

// Initialize scheduled jobs (reminder emails)
if (process.env.NODE_ENV !== 'test') {
  initReminderJob();
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/players', playersRouter);
app.use('/api/games', gamesRouter);
app.use('/api/stats', statsRouter);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error details in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
  } else {
    console.error('Error:', err.message);
  }

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Send appropriate error response
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
