# 🚀 Railway Deployment - SIMPLE 5-STEP GUIDE

## ✅ Files Ready for Deployment

I've prepared everything! Here's what I added:

1. ✅ `railway.json` - Railway configuration
2. ✅ `nixpacks.toml` - Build configuration
3. ✅ `application-prod.yml` - Production settings updated
4. ✅ `frontend/src/config/api.ts` - API URL configuration
5. ✅ Updated `authApi.ts` - Uses dynamic API URL

---

## 🎯 NOW FOLLOW THESE 5 STEPS:

### STEP 1: Push to GitHub (5 minutes)

```bash
cd /Users/ebabayan/dev/expense-tracker

# If not already a git repo:
git init
git add .
git commit -m "Ready for Railway deployment"

# Create a new repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git branch -M main
git push -u origin main
```

**⏸️ PAUSE HERE** - Make sure code is on GitHub before continuing!

---

### STEP 2: Sign Up & Create Project (2 minutes)

1. Go to **https://railway.app**
2. Click **"Start a New Project"**
3. Click **"Login with GitHub"**
4. Authorize Railway to access your repos
5. Click **"Deploy from GitHub repo"**
6. Select your **expense-tracker** repository

✅ Railway will start deploying automatically!

---

### STEP 3: Add Database & Redis (3 minutes)

In your Railway project dashboard:

#### Add PostgreSQL:
1. Click **"+ New"** button
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. ✅ Done! Railway auto-configures it

#### Add Redis:
1. Click **"+ New"** button again
2. Select **"Database"**
3. Choose **"Add Redis"**
4. ✅ Done! Railway auto-configures it

---

### STEP 4: Set Environment Variables (3 minutes)

Click on your **backend service** (the one Railway deployed from GitHub):

1. Go to **"Variables"** tab
2. Click **"+ New Variable"**
3. Add these **3 variables**:

```bash
Name: SPRING_PROFILES_ACTIVE
Value: prod

Name: JWT_SECRET
Value: your-super-secret-key-at-least-256-bits-change-this-production

Name: FRONTEND_URL
Value: https://your-backend-url.railway.app
```

(For now, use the backend URL for FRONTEND_URL, we'll update it later)

4. Click **"Deploy"** to restart with new variables

---

### STEP 5: Get Your URLs & Test! (2 minutes)

#### Get Backend URL:
1. Click on your backend service
2. Go to **"Settings"** tab
3. Scroll to **"Domains"**
4. Click **"Generate Domain"**
5. **Copy this URL!** (e.g., `https://expense-tracker-production.up.railway.app`)

#### Access Your App:
**Your API is now live at**: `https://your-domain.railway.app/api`

#### Test Backend:
```bash
curl https://your-domain.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "firstName": "Test",
    "lastName": "User"
  }'
```

---

## 🎉 YOU'RE DONE!

Your backend is **LIVE** on Railway!

### What You Have Now:
✅ Backend API running
✅ PostgreSQL database
✅ Redis cache
✅ Auto-deploys on git push

---

## 🔄 Optional: Deploy Frontend Separately

If you want the frontend on Railway too:

### Add Frontend Service:
1. In Railway dashboard, click **"+ New"**
2. Select **"GitHub Repo"** (same repo)
3. **Configure**:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`

4. **Add Variable**:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

5. **Generate Domain** for frontend
6. **Update Backend** FRONTEND_URL variable to your new frontend URL

---

## 🐛 Troubleshooting

### "Build Failed"?
- Check Railway logs in dashboard
- Click on deployment → View logs

### "Can't connect to database"?
- Railway auto-provides `DATABASE_URL`
- Check PostgreSQL service is running

### Need Help?
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

---

## 📊 Your Railway Dashboard Will Show:

```
┌─────────────────────────────────────┐
│  Railway Project: expense-tracker   │
├─────────────────────────────────────┤
│  Services:                          │
│  ✅ backend (Spring Boot)           │
│  ✅ PostgreSQL                      │
│  ✅ Redis                           │
│  (optional: frontend)               │
└─────────────────────────────────────┘
```

---

## 💰 Cost

**Free Trial**: $5 credit/month
**Your Usage**: ~$3-5/month
**Result**: FREE! ✨

---

## ⚡ Quick Reference

```bash
# Railway CLI (optional)
npm install -g @railway/cli
railway login
railway status
railway logs
```

---

**Ready to start?** 

👉 **BEGIN WITH STEP 1** - Push your code to GitHub!

Let me know when you complete Step 1, and I'll help with the next steps!

