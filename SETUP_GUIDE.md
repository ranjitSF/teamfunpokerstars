# 🎯 Quick Setup Guide

Follow these steps to get your Poker Championship Tracker up and running!

## Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Email/Password** authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
4. Get Web App credentials:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Add a web app or use existing
   - Copy the config values (apiKey, authDomain, etc.)
5. Get Service Account credentials:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Extract: `project_id`, `private_key`, `client_email`

## Step 2: Database Setup

### Option A: Supabase (Recommended)
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Project Settings > Database
4. Copy the connection string (use "Connection Pooling" for Vercel)
5. Use SQL Editor to run `server/database/schema.sql`

### Option B: Neon
1. Go to [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Run the schema

### Option C: Railway
1. Go to [Railway](https://railway.app)
2. Create PostgreSQL database
3. Copy connection URL
4. Run the schema

## Step 3: Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate app-specific password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
3. Use this password in `SMTP_PASS`

## Step 4: Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in all the values in `.env`

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## Step 5: Deploy to Vercel

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial setup"
   git push
   ```

2. Import to Vercel:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repo
   - Add all environment variables from `.env`
   - Add `CRON_SECRET` (generate random string)
   - Deploy!

3. Update environment variables:
   - Set `APP_URL` to your Vercel URL
   - Set `VITE_API_URL` to your Vercel URL + `/api`
   - Use production database URL

## Step 6: Add Authorized Players

After first deployment, you or your friends can sign up using the authorized email addresses. The first person to sign up becomes a player automatically.

To pre-authorize specific emails, you can either:
- Let anyone with the URL sign up (simpler)
- Or add validation in `server/routes/players.js` to check against a whitelist

## 🎉 You're Done!

Your Poker Championship Tracker is now live and ready to track your games!

## 📞 Need Help?

Common issues:
- **Can't connect to database**: Check your DATABASE_URL format
- **Firebase auth not working**: Verify all Firebase env variables
- **Emails not sending**: Check SMTP credentials and enable "Less secure apps" if using Gmail
- **Build errors**: Run `npm install` again and check Node.js version (18+)

## 🔄 Updating the App

```bash
git pull
npm install
npm run dev  # Test locally
git push     # Vercel auto-deploys
```

## 🎨 Customization

- Colors: Edit `tailwind.config.js`
- Logo: Replace in `src/components/Layout.jsx`
- Points system: Modify `server/utils/points.js`
- Email templates: Edit `server/utils/email.js`
