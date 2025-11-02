# 🚀 Railway Deployment - Step by Step Guide

## Prerequisites
- GitHub account
- Railway account (sign up with GitHub)

---

## 📋 STEP-BY-STEP DEPLOYMENT

### Step 1: Push Code to GitHub (If Not Already)

```bash
cd /Users/ebabayan/dev/expense-tracker

# Initialize git (if needed)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Railway deployment"

# Create GitHub repo and push
# (Create repo on GitHub first, then:)
git remote add origin https://github.com/ElenBabayan/expense-tracker.git
git branch -M main
git push -u origin main
```

---

### Step 2: Sign Up for Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign in with GitHub
4. Authorize Railway

---

### Step 3: Deploy Backend

#### A. Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your `expense-tracker` repository
4. Railway will auto-detect the Dockerfile

#### B. Configure Backend Service
1. **Set Root Directory** (if needed): `.` (project root)
2. **Add Environment Variables**:
   - Click on your service
   - Go to "Variables" tab
   - Add these variables:

```bash
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=your-super-secret-jwt-key-min-256-bits-for-production-use-only
```

#### C. Add PostgreSQL
1. In your project dashboard, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create `DATABASE_URL`
4. **Add these additional variables** to your backend service:
   - Go to backend service → Variables
   - Railway auto-creates `DATABASE_URL`, but we need to extract parts:

```bash
# Railway provides DATABASE_URL like:
# postgresql://user:password@host:port/database

# We need to add (Railway will inject from DATABASE_URL):
DATABASE_URL=${DATABASE_URL}
DATABASE_USERNAME=${PGUSER}
DATABASE_PASSWORD=${PGPASSWORD}
```

#### D. Add Redis
1. In your project dashboard, click "New"
2. Select "Database" → "Add Redis"
3. Railway will automatically create `REDIS_URL`
4. **Add these variables** to your backend service:

```bash
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASSWORD}
```

#### E. Generate Domain for Backend
1. Click on your backend service
2. Go to "Settings" tab
3. Scroll to "Networking"
4. Click "Generate Domain"
5. **Copy this URL** (e.g., `https://expense-tracker-production.up.railway.app`)

---

### Step 4: Deploy Frontend

#### A. Create Frontend Service
1. In your project dashboard, click "New"
2. Select "GitHub Repo" (same repository)
3. This time, configure for frontend:

#### B. Configure Frontend Service
1. **Set Root Directory**: `frontend`
2. **Build Command**: `npm run build`
3. **Start Command**: `npm run preview` or use static hosting

#### C. Add Environment Variables
```bash
VITE_API_URL=https://your-backend-domain.railway.app/api
```

(Replace with your actual backend domain from Step 3E)

#### D. Generate Domain for Frontend
1. Click on frontend service
2. Go to "Settings" tab
3. Generate domain
4. **Copy this URL** (e.g., `https://expense-tracker-frontend.railway.app`)

---

### Step 5: Update CORS

1. Go back to **backend service**
2. Add/update environment variable:

```bash
FRONTEND_URL=https://your-frontend-domain.railway.app
```

(Replace with your actual frontend domain from Step 4D)

3. Redeploy backend (it will auto-redeploy)

---

### Step 6: Initialize Database

#### Option A: Auto-initialization (JPA will create tables)
- Set `spring.jpa.hibernate.ddl-auto=update` (already done)
- Tables will be created automatically on first run

#### Option B: Manual SQL (Optional)
1. Go to PostgreSQL service in Railway
2. Click "Connect" → "Connect via CLI"
3. Run the schema from `/src/main/resources/db/schema.sql`

---

### Step 7: Test Your Deployment! 🎉

1. Open your frontend URL: `https://your-frontend.railway.app`
2. Register a new account
3. Login
4. Test all features!

---

## 🔧 Environment Variables Summary

### Backend Service
```bash
# Required
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=your-256-bit-secret-key-change-this-in-production

# Auto-provided by Railway (just reference them)
DATABASE_URL=${DATABASE_URL}
DATABASE_USERNAME=${PGUSER}
DATABASE_PASSWORD=${PGPASSWORD}
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASSWORD}

# Will add after frontend deployment
FRONTEND_URL=https://your-frontend-url.railway.app
```

### Frontend Service
```bash
VITE_API_URL=https://your-backend-url.railway.app/api
```

---

## 📊 Expected Services in Railway

After deployment, you should have **4 services**:

1. **Backend** (Spring Boot) - Your API
2. **Frontend** (Vite/React) - Your UI
3. **PostgreSQL** - Database
4. **Redis** - Cache/Sessions

---

## 🐛 Troubleshooting

### Backend won't start?
- Check logs in Railway dashboard
- Verify all environment variables are set
- Make sure PostgreSQL and Redis are running

### Frontend can't connect to backend?
- Verify `VITE_API_URL` is correct
- Check CORS: Make sure `FRONTEND_URL` is set in backend
- Open browser console for errors

### Database connection error?
- Railway provides `DATABASE_URL` automatically
- Make sure it's being read in `application-prod.yml`

### Redis connection error?
- Check Redis service is running
- Verify `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`

---

## 💰 Cost Estimate

**Railway Free Trial**: $5 credit
**Monthly Usage**: ~$5-8 for all services

Services breakdown:
- Backend: ~$2-3/month
- PostgreSQL: ~$1-2/month  
- Redis: ~$1/month
- Frontend: ~$1/month

**Total**: Stays within free $5 credit for development!

---

## 🎯 Quick Railway CLI Method (Alternative)

If you prefer CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project (or create new)
railway link

# Deploy backend
railway up

# Add services
railway add postgresql
railway add redis

# Set variables
railway variables set SPRING_PROFILES_ACTIVE=prod
railway variables set JWT_SECRET=your-secret-key

# Deploy frontend
cd frontend
railway up
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend is running (check logs)
- [ ] PostgreSQL is connected
- [ ] Redis is connected  
- [ ] Frontend is accessible
- [ ] Can register new user
- [ ] Can login
- [ ] Can access dashboard
- [ ] Can view profile
- [ ] Sessions persist (Redis working)

---

## 🔗 Useful Railway Commands

```bash
# View logs
railway logs

# Check status
railway status

# Open dashboard
railway open

# Connect to database
railway connect postgres

# Connect to Redis
railway connect redis
```

---

## 📝 Notes

1. **First deployment takes 5-10 minutes**
2. **Subsequent deploys are faster** (~2-3 minutes)
3. **Auto-deploys on git push** (if enabled)
4. **Free tier sleeps after 500 hours** (shouldn't happen with $5 credit)
5. **Can add custom domain** (free with Railway Pro)

---

## 🎉 You're Done!

Your Expense Tracker is now live on Railway! 

**Share your app**: `https://your-frontend.railway.app`

---

**Need help?** Railway has excellent documentation and support!
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

