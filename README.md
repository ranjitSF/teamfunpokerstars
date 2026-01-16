# ♠️ Team Fun Poker Stars Championship Series

An elegant, full-featured web application for tracking poker championship rankings among friends. Built with React, Node.js, PostgreSQL, and Firebase Authentication.

## ✨ Features

- **User Authentication**: Secure email-based authentication via Firebase
- **Real-time Dashboard**: Beautiful dashboard with comprehensive statistics
- **Leaderboard**: All-time and yearly rankings with elegant podium display
- **Game Management**: Create poker sessions and track results
- **Smart Scoring**: Position-based points system that rewards consistency
- **Automated Reminders**: Email notifications for unrecorded game results
- **Responsive Design**: Elegant UI that works on all devices
- **Comprehensive Stats**: Win rates, average positions, streaks, and more

## 🚀 Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- React Router for navigation
- Lucide React for icons

### Backend
- Node.js with Express
- PostgreSQL database
- Firebase Authentication
- Nodemailer for email notifications
- Node-cron for scheduled tasks

### Deployment
- Vercel for hosting
- Vercel Cron Jobs for scheduled emails

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Firebase project (for authentication)
- SMTP credentials (for email notifications)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd PokerRankings
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   - Create a new PostgreSQL database
   - Run the schema from `server/database/schema.sql`
   ```bash
   psql -U your_username -d your_database -f server/database/schema.sql
   ```

4. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Email/Password authentication
   - Download service account credentials (for Firebase Admin)
   - Get your web app configuration

5. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Fill in all required values:

   ```bash
   # Firebase Web Configuration
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Firebase Admin (Server)
   FIREBASE_ADMIN_PROJECT_ID=your_project_id
   FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
   FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com

   # Database
   DATABASE_URL=postgresql://user:password@host:port/database

   # Email (Gmail example)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   FROM_EMAIL=noreply@yourdomain.com

   # App
   APP_URL=http://localhost:3000
   PORT=3001
   ```

6. **Run database migrations**
   The schema will create all necessary tables, views, and indexes.

## 🏃 Running Locally

### Development Mode
```bash
npm run dev
```

This runs both the frontend (port 3000) and backend (port 3001) concurrently.

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

### Production Build
```bash
npm run build
npm start
```

## 🌐 Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add all environment variables from `.env`
   - Add one additional variable: `CRON_SECRET` (generate a random string)
   - Deploy!

3. **Set up Database**
   - Use a hosted PostgreSQL service (Supabase, Railway, Neon, etc.)
   - Update `DATABASE_URL` in Vercel environment variables

4. **Configure Cron Job**
   The cron job is automatically configured via `vercel.json` to run hourly.

## 📊 Points System

The app uses a podium-based scoring system that rewards top finishers:

- **1st place**: 100 points 🥇
- **2nd place**: 50 points 🥈
- **3rd place**: 10 points 🥉
- **4th+ place**: 0 points

Only the top 3 finishers earn points in each game, rewarding podium finishes and consistent top performance.

## 📧 Email Notifications

The app automatically sends reminder emails:
- Triggered 24 hours after a game if positions aren't recorded
- Beautiful HTML emails with branding
- Only sent once per game

## 🎨 Design Philosophy

The app features an elegant, premium design inspired by:
- Sophisticated poker aesthetics
- Gold and dark color palette
- Smooth animations and transitions
- Modern card-based layouts
- Responsive grid systems

## 📁 Project Structure

```
PokerRankings/
├── server/                 # Backend
│   ├── config/            # Firebase, database config
│   ├── database/          # Schema and DB connection
│   ├── jobs/              # Cron jobs
│   ├── routes/            # API endpoints
│   ├── utils/             # Helper functions
│   └── index.js           # Server entry point
├── src/                   # Frontend
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── services/          # API service layer
│   ├── config/            # Firebase client config
│   └── App.jsx            # App entry point
├── api/                   # Vercel serverless functions
│   └── cron/              # Cron job handlers
└── public/                # Static assets
```

## 🔐 Security Notes

- Never commit `.env` file
- Use Firebase Authentication for secure user management
- API endpoints are protected with JWT verification
- Passwords are handled by Firebase (not stored in your DB)
- SMTP credentials should use app-specific passwords

## 🎯 Usage

### For Players:
1. Sign up with your authorized email
2. View your stats on the dashboard
3. Check rankings on the leaderboard
4. Review game history

### For Game Organizers:
1. Create a new game session
2. Set the date (stored in PST timezone)
3. After the game, enter final positions
4. System automatically calculates points

## 🤝 Contributing

This is a private app for your poker group, but feel free to fork and customize for your own use!

## 📝 License

MIT License - Feel free to use and modify for your own poker group.

## 🎰 Credits

Built with ❤️ for poker enthusiasts who love tracking their championship journey.

---

**May the odds be ever in your favor!** ♠️♣️♥️♦️
