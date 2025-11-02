# 🚀 Deployment Guide

## Quick Deployment Options

### 🎯 Recommended: Railway (All-in-One)

**Cost**: FREE ($5 credit/month)
**Includes**: Backend, Frontend, PostgreSQL, Redis

---

## Option 1: Railway Deployment (Easiest)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Initialize Project
```bash
cd /Users/ebabayan/dev/expense-tracker
railway init
```

### Step 4: Deploy Backend
```bash
# Railway will detect Dockerfile automatically
railway up
```

### Step 5: Add Database Services
```bash
# Add PostgreSQL
railway add postgresql

# Add Redis
railway add redis
```

### Step 6: Set Environment Variables
Go to Railway dashboard and set:
```
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=your-production-secret-key-min-256-bits
FRONTEND_URL=https://your-app.railway.app
```

### Step 7: Deploy Frontend
```bash
cd frontend
# Railway will auto-detect and deploy
railway up
```

---

## Option 2: Split Deployment (Best Performance)

### Backend: Railway
1. Sign up at https://railway.app
2. Create new project
3. Deploy from GitHub (push your code first)
4. Add PostgreSQL and Redis from Railway marketplace
5. Set environment variables

### Frontend: Vercel
1. Sign up at https://vercel.com
2. Import GitHub repository
3. Set root directory to `frontend`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
5. Deploy

---

## Option 3: Render (Free Tier)

### Backend
1. Sign up at https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Build command: `mvn clean package`
5. Start command: `java -jar target/expense-tracker-1.0.0-SNAPSHOT.jar`
6. Add PostgreSQL database (free)

### Frontend
1. Create new Static Site
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `dist`

---

## Pre-Deployment Checklist

### ✅ Required Changes

1. **Update CORS in Backend**
   - Allow production frontend URL
   
2. **Environment Variables**
   - Production database URL
   - Production Redis URL
   - JWT secret
   - Frontend URL

3. **Frontend API URL**
   - Point to production backend
   
4. **Database Migration**
   - Run schema.sql on production DB

---

## Cost Comparison

| Service | Backend | Database | Redis | CDN | Cost |
|---------|---------|----------|-------|-----|------|
| **Railway** | ✅ | ✅ PostgreSQL | ✅ | ✅ | $5 credit/mo (FREE) |
| **Render** | ✅ | ✅ PostgreSQL | ❌ | ✅ | FREE (sleeps) |
| **Vercel + Railway** | Railway | Railway PG | Railway | Vercel | $5 credit/mo |
| **Netlify + Render** | Render | Render PG | ❌ | Netlify | FREE (sleeps) |

---

## Recommendation

### For Learning/Demo: Railway 🏆
- Everything in one place
- Easy setup
- Free tier sufficient
- No sleep mode
- Includes Redis

### For Production: Vercel (Frontend) + Railway (Backend)
- Best performance
- Separate concerns
- Easy scaling
- Professional setup

---

## Next Steps

1. Choose deployment platform
2. Push code to GitHub (if not already)
3. I'll help configure the deployment
4. Deploy!

**Which option would you like to use?**
- Railway (easiest, all-in-one)
- Vercel + Railway (best performance)
- Render (100% free but sleeps)

Let me know and I'll prepare the specific configuration files!

