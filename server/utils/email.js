import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Base email template wrapper
 * @param {Object} options - Template options
 * @param {string} options.icon - Emoji icon for the content
 * @param {string} options.content - HTML content for the email body
 * @param {string} options.footerText - Text for the footer
 * @returns {string} Complete HTML email
 */
const emailTemplate = ({ icon, content, footerText }) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Arial', sans-serif; background-color: #0a0e1a; color: #ffffff; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: linear-gradient(135deg, #1a1f35 0%, #0f1320 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(212, 175, 55, 0.2); }
      .header { background: linear-gradient(135deg, #d4af37 0%, #ffd700 100%); padding: 30px; text-align: center; }
      .header h1 { margin: 0; color: #0a0e1a; font-size: 28px; }
      .content { padding: 40px 30px; }
      .card-icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
      .button { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #ffd700 100%); color: #0a0e1a; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
      .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #2a2f45; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Poker Championship Tracker</h1>
      </div>
      <div class="content">
        <div class="card-icon">${icon}</div>
        ${content}
      </div>
      <div class="footer">
        <p>Poker Championship Tracker | ${footerText}</p>
      </div>
    </div>
  </body>
  </html>
`;

const appUrl = process.env.APP_URL || 'http://localhost:3000';

/**
 * Send reminder email to players about unfinalized game
 * @param {Array} players - Array of player objects {email, name}
 * @param {Object} game - Game object {id, game_date}
 */
export const sendGameReminderEmail = async (players, game) => {
  try {
    const gameDate = new Date(game.game_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const emailPromises = players.map((player) => {
      const content = `
        <p>Hi ${player.name},</p>
        <p>The poker game from <strong>${gameDate}</strong> still needs final positions to be recorded.</p>
        <p>Please log in to submit the final standings. Every game counts towards the championship!</p>
        <center>
          <a href="${appUrl}" class="button">Submit Results</a>
        </center>
      `;

      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to: player.email,
        subject: 'Poker Night Results Needed',
        html: emailTemplate({
          icon: '🃏',
          content,
          footerText: 'Keeping the game fair and competitive',
        }),
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);
    console.log(`Reminder emails sent for game ${game.id}`);
    return true;
  } catch (error) {
    console.error('Error sending reminder emails:', error);
    return false;
  }
};

/**
 * Send welcome email to new player
 * @param {Object} player - Player object {email, name}
 */
export const sendWelcomeEmail = async (player) => {
  try {
    const content = `
      <p>Welcome ${player.name}!</p>
      <p>You've been added to the Poker Championship tracking system. Now you can:</p>
      <ul>
        <li>View real-time leaderboards and statistics</li>
        <li>Create and manage poker sessions</li>
        <li>Track your performance over time</li>
        <li>Compete for the championship title</li>
      </ul>
      <center>
        <a href="${appUrl}" class="button">Go to Dashboard</a>
      </center>
    `;

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: player.email,
      subject: 'Welcome to the Poker Championship!',
      html: emailTemplate({
        icon: '🎰',
        content,
        footerText: 'May the odds be ever in your favor',
      }),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${player.email}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};
