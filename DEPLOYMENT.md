# Deployment Guide - Team Fun Poker Stars Championship Series

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Create Firebase project at https://console.firebase.google.com
- [ ] Enable Firebase Authentication (Email Link / Passwordless)
- [ ] Create PostgreSQL database (Supabase, Railway, or Neon recommended)
- [ ] Set up environment variables for production

### 2. Required Accounts
- [ ] GitHub account (for repository)
- [ ] Vercel account (recommended for frontend deployment)
- [ ] Railway/Render account (recommended for backend deployment)
- [ ] Firebase account (for authentication)
- [ ] Database hosting (Supabase/Railway/Neon)

---

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) [RECOMMENDED]

**Pros:**
- Easy setup with automatic deployments
- Free tier available
- Great performance
- Serverless functions for backend

**Frontend (Vercel):**
1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables
4. Deploy

**Backend (Railway):**
1. Create new project in Railway
2. Connect GitHub repository
3. Configure PostgreSQL database
4. Set environment variables
5. Deploy

### Option 2: All-in-One (Render)

**Pros:**
- Single platform for frontend + backend
- PostgreSQL included
- Simpler management

**Steps:**
1. Push code to GitHub
2. Create Web Service for frontend
3. Create Web Service for backend
4. Create PostgreSQL database
5. Configure environment variables

---

## Environment Variables

### Frontend (.env for production)
```bash
# Mode (remove this or set to 'production' for real deployment)
# VITE_MODE=demo

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API URL (your backend URL)
VITE_API_URL=https://your-backend.railway.app/api
```

### Backend (server environment variables)
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Firebase Admin (for backend verification)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Server Configuration
PORT=3001
NODE_ENV=production

# Admin Email
ADMIN_EMAIL=your-admin-email@example.com
```

---

## 📦 Build Commands

### Frontend
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Backend
```bash
# The backend runs directly with Node.js
# Start command: node server/index.js
```

---

## Firebase Setup

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name: "Team Fun Poker Stars" (or your choice)
4. Disable Google Analytics (optional)

### 2. Enable Authentication
1. Go to Authentication → Sign-in method
2. Enable "Email/Password" provider
3. Enable "Email link (passwordless sign-in)"
4. Configure authorized domains (add your deployment URL)

### 3. Get Configuration
1. Go to Project Settings → General
2. Scroll to "Your apps" → Web app
3. Copy the configuration values
4. Add to your .env file

### 4. Create Service Account (for backend)
1. Go to Project Settings → Service accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. Extract values for backend environment variables:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### 5. Configure Email Settings
1. Go to Authentication → Templates
2. Customize "Email link sign-in" template
3. Set sender name: "Team Fun Poker Stars"
4. Update email content if desired

---

## Database Setup

### Option A: Supabase (Recommended)
1. Create account at https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Run schema from `server/database/schema.sql`

### Option B: Railway
1. Create account at https://railway.app
2. Create PostgreSQL service
3. Get connection string from Variables tab
4. Run schema from `server/database/schema.sql`

### Option C: Neon
1. Create account at https://neon.tech
2. Create project and database
3. Get connection string
4. Run schema from `server/database/schema.sql`

### Database Schema
Run the schema file to create all tables and views:
- `server/database/schema.sql`

---

## Deployment Steps

### Step 1: Push to GitHub

```bash
# Check git status
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: Complete poker championship tracker

- Implement magic link authentication
- Add admin-only features (create games, delete games, add players)
- Implement podium scoring system (100/50/10 points)
- Add scoring tooltips across all pages
- Create demo mode for local testing
- Style with Inter font throughout
- Add responsive design for mobile"

# Create repository on GitHub (if not exists)
# Then add remote and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/poker-rankings.git
git push -u origin main
```

### Step 2: Deploy Frontend (Vercel)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Repository**
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables**
   - Add all `VITE_*` variables from your production .env
   - **Important:** Remove or comment out `VITE_MODE=demo`
   - Set `VITE_API_URL` to your backend URL (from Step 3)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your deployment URL (e.g., https://poker-rankings.vercel.app)

### Step 3: Deploy Backend (Railway)

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Create new project

2. **Add PostgreSQL Database**
   - Click "+ New"
   - Select "Database" → "PostgreSQL"
   - Wait for provisioning

3. **Add Backend Service**
   - Click "+ New"
   - Select "GitHub Repo"
   - Choose your repository
   - Configure:
     - Root Directory: ./
     - Start Command: `node server/index.js`
     - Build Command: `npm install`

4. **Environment Variables**
   - Add all backend environment variables
   - Get `DATABASE_URL` from PostgreSQL service variables
   - Add Firebase service account credentials
   - Set `PORT` (Railway provides this automatically usually)

5. **Run Database Schema**
   - Connect to database using provided connection string
   - Run SQL from `server/database/schema.sql`
   - Or use Railway's SQL console

6. **Deploy**
   - Railway auto-deploys on push
   - Note your backend URL (e.g., https://poker-rankings-backend.railway.app)

7. **Update Frontend**
   - Go back to Vercel
   - Update `VITE_API_URL` environment variable with Railway backend URL
   - Redeploy frontend

### Step 4: Configure Firebase Authorized Domains

1. Go to Firebase Console → Authentication → Settings
2. Add authorized domains:
   - Your Vercel domain (e.g., `poker-rankings.vercel.app`)
   - Railway backend domain
   - `localhost` (for local development)

### Step 5: Test Deployment

1. **Visit your Vercel URL**
2. **Test Authentication:**
   - Enter email address
   - Check email for magic link
   - Click link to authenticate
3. **Test Admin Features:**
   - Login with `ranjit.jose.2012@gmail.com`
   - Verify "New Game", "Delete Game", "Add Player" buttons visible
4. **Test User Features:**
   - Login with different email
   - Verify admin buttons are hidden
   - Verify can view all pages and edit results
5. **Test Scoring:**
   - Create a game
   - Add results with positions
   - Verify points calculated correctly (100/50/10)

---

## Security Checklist

- [ ] `.env` file in `.gitignore` (never commit secrets)
- [ ] `service-account.json` in `.gitignore`
- [ ] Firebase security rules configured
- [ ] Database password is strong
- [ ] Admin email properly restricted
- [ ] CORS configured for production domains only
- [ ] Environment variables set in deployment platforms (not in code)

---

## Post-Deployment

### Add Your Friends as Players
1. Login as admin (`ranjit.jose.2012@gmail.com`)
2. Go to Players page
3. Click "Add Player"
4. Enter friend's name and email
5. They will receive magic link to sign in

### Monitor Application
- Check Vercel Analytics for frontend performance
- Check Railway Logs for backend errors
- Monitor Firebase Authentication usage
- Monitor database connection pool

### Custom Domain (Optional)
1. Purchase domain (Namecheap, Google Domains, etc.)
2. In Vercel: Settings → Domains → Add domain
3. Configure DNS records as instructed
4. Update Firebase authorized domains

---

## Troubleshooting

### Issue: Magic link emails not sending
- Check Firebase Authentication is enabled
- Verify email templates are configured
- Check spam folder
- Verify authorized domains include deployment URL

### Issue: Database connection errors
- Verify `DATABASE_URL` is correct
- Check database is running
- Verify schema has been run (`server/database/schema.sql`)
- Check connection pool limits

### Issue: Admin features not showing
- Verify email matches exactly `ranjit.jose.2012@gmail.com`
- Check browser console for errors
- Verify AuthContext is setting `isAdmin` correctly

### Issue: CORS errors
- Update backend to allow frontend domain
- Add to `server/index.js` CORS configuration
- Redeploy backend

### Issue: Build fails
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

---

## Maintenance

### Regular Tasks
- Monitor user feedback
- Check for security updates (`npm audit`)
- Update dependencies monthly
- Backup database regularly
- Review Firebase usage/quota

### Adding New Features
1. Test locally in demo mode
2. Commit changes to GitHub
3. Push to main branch
4. Automatic deployment via Vercel/Railway
5. Test on production

---

## Tips

1. **Use Demo Mode for Development**
   - Keep `VITE_MODE=demo` in local `.env`
   - No backend needed for UI development
   - Fast iteration

2. **Separate Environments**
   - Consider separate Firebase projects for dev/prod
   - Use different databases for testing

3. **Monitoring**
   - Set up uptime monitoring (UptimeRobot, etc.)
   - Enable error tracking (Sentry recommended)

4. **Backups**
   - Enable automated database backups
   - Export game data regularly

---

## Deployment Complete

Once all steps are completed, the application will be accessible at your configured URL.

---

## Custom Domain Setup

### Step-by-Step Domain Configuration

#### 1. Purchase the Domain
**Recommended Registrar:** Namecheap or Google Domains

- Search for: `teamfunpokerstars.com`
- Add to cart and purchase
- Consider also purchasing `.net` and `.org` for brand protection
- Estimated cost: $10-15/year

#### 2. Configure in Vercel
1. Go to Vercel Dashboard → Your Project
2. Click Settings → Domains
3. Click "Add Domain"
4. Enter: `teamfunpokerstars.com`
5. Click "Add"
6. Also add: `www.teamfunpokerstars.com`
7. Vercel will show you the DNS records to configure

#### 3. DNS Configuration

In your domain registrar's DNS management panel, add these records:

**Root Domain Configuration:**
```
Type: A Record
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or default)
```

**WWW Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or default)
```

**Alternative (if using Cloudflare):**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
Proxy: Enabled (orange cloud)
```

#### 4. Verify DNS Propagation
Wait 10-60 minutes, then check:
```bash
# Check A record
dig teamfunpokerstars.com +short

# Check CNAME
dig www.teamfunpokerstars.com +short
```

Or use online tool: https://dnschecker.org

#### 5. Update Firebase
1. Firebase Console → Authentication → Settings
2. Click "Authorized domains"
3. Click "Add domain"
4. Add: `teamfunpokerstars.com`
5. Add: `www.teamfunpokerstars.com`

#### 6. Update Backend CORS
Edit `server/index.js` to allow your domain:

```javascript
const cors = require('cors');

const allowedOrigins = [
  'https://teamfunpokerstars.com',
  'https://www.teamfunpokerstars.com',
  'https://poker-rankings.vercel.app', // Keep for testing
  'http://localhost:3001' // Keep for local dev
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

#### 7. SSL Certificate
- Vercel automatically provisions SSL (Let's Encrypt)
- Certificate renews automatically
- Your site will be `https://teamfunpokerstars.com` ✅
- HTTP automatically redirects to HTTPS

#### 8. Final Testing
Visit your domain and test:
- [ ] `https://teamfunpokerstars.com` loads correctly
- [ ] `https://www.teamfunpokerstars.com` loads correctly
- [ ] SSL certificate shows valid (green lock icon)
- [ ] Login works with magic link
- [ ] Admin features work
- [ ] All pages load correctly

---

## User Access

**URL:** https://teamfunpokerstars.com (or your configured domain)

User sign-up process:
1. Visit the website
2. Enter email address
3. Click the magic link in email
4. Access the application

