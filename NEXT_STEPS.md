# Next Steps for Poker Championship Tracker

This guide covers setup, customization, and usage of the application.

## ✅ Immediate Tasks

### 1. Set Up Firebase (5 minutes)
- Create a Firebase project at https://console.firebase.google.com
- Enable Email/Password authentication
- Get your web config and service account credentials
- See `SETUP_GUIDE.md` for detailed steps

### 2. Set Up Database (5 minutes)
Choose one of these:
- **Supabase** (Recommended): https://supabase.com - Free tier, easy to use
- **Neon**: https://neon.tech - Serverless Postgres
- **Railway**: https://railway.app - Simple deployment

Run the schema from `server/database/schema.sql`

### 3. Configure Email (5 minutes)
- Use Gmail with app-specific password
- Or use SendGrid/Mailgun for production
- Test locally first!

### 4. Test Locally (10 minutes)
```bash
cp .env.example .env
# Fill in your credentials in .env
npm install
npm run dev
```

Visit http://localhost:3000 and test:
- Sign up with your email
- Create a game
- Add results
- Check dashboard stats

### 5. Deploy to Vercel (10 minutes)
```bash
# Push to GitHub
git remote add origin <your-github-url>
git push -u origin main

# Then import to Vercel
# Add all environment variables
# Deploy!
```

## 📋 Customization Ideas

### Add Your Player List
Edit `server/routes/players.js` to add email whitelist:

```javascript
const AUTHORIZED_EMAILS = [
  'player1@example.com',
  'player2@example.com',
  'player3@example.com',
  // ... add all your players
];

// In the sync route, add validation
if (!AUTHORIZED_EMAILS.includes(email)) {
  return res.status(403).json({ error: 'Not authorized' });
}
```

### Customize Points System
Edit `server/utils/points.js` to change scoring:

```javascript
// Current scoring: 1st = 100, 2nd = 50, 3rd = 10, 4th+ = 0
// Only top 3 finishers earn points
```

### Change Theme Colors
Edit `tailwind.config.js`:

```javascript
colors: {
  poker: {
    dark: '#0a0e1a',      // Background
    card: '#1a1f35',      // Card backgrounds
    accent: '#d4af37',    // Gold accent
    gold: '#ffd700',      // Bright gold
  },
}
```

### Add More Stats
The database views are extensible. Add to `schema.sql`:
- Longest winning streaks
- Best comeback stories
- Most improved player
- Monthly MVPs

## 🎮 Using the App

### Monthly Poker Night Workflow
1. **Before the game**: Create event in the app (set date)
2. **During the game**: Players track their own positions
3. **After the game**: Someone enters final positions
4. **Next day**: System sends reminders if not entered
5. **Anytime**: Check leaderboard and stats!

### Managing Players
- New players sign up through the app
- Or you can pre-create accounts in Firebase
- Admins can see all players in the "Players" tab

### Viewing Stats
- **Dashboard**: Personal performance
- **Leaderboard**: Overall rankings
- **Games**: Full history with details
- **Players**: Compare with others

## 🚀 Advanced Features to Add

Want to extend the app? Here are ideas:

### 1. Achievements/Badges
- "Hat Trick" - 3 wins in a row
- "Comeback King" - Most improved
- "Consistent" - Low position variance
- "Champion" - Most total points

### 2. Season System
- Define seasons (e.g., Jan-Dec)
- Season champions
- Season playoffs

### 3. Buy-in Tracking
- Optional money tracking
- Winnings calculator
- Settlement suggestions

### 4. Advanced Analytics
- Win probability calculator
- Player matchup history
- Performance trends
- Prediction models

### 5. Social Features
- In-app chat
- Game comments/notes
- Photo uploads
- Twitter/social sharing

### 6. Mobile App
- Use React Native
- Share backend API
- Push notifications

## 📞 Support

### Common Issues

**"Module not found" errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Database connection fails**
- Check DATABASE_URL format
- Ensure database is accessible from your IP
- Test with `psql` command

**Firebase auth not working**
- Verify all VITE_ prefixed env vars
- Check Firebase console for enabled methods
- Clear browser cache

**Emails not sending**
- Test SMTP credentials with nodemailer
- Check spam folder
- Enable "Less secure apps" for Gmail

### Getting Help
- Check `README.md` for full documentation
- Review `SETUP_GUIDE.md` for setup steps
- Search error messages
- Check Firebase/Vercel logs

## Application Capabilities

The Poker Championship Tracker can:
- Track games and players
- Calculate rankings automatically
- Send reminder emails
- Work on desktop and mobile devices
