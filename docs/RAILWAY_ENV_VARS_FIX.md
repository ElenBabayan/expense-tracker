# ⚠️ CRITICAL: DATABASE_URL NOT SET!

## The Problem:
```
Connection to localhost:5432 refused
```

The app is using the **default/fallback value** (`localhost:5432`) instead of Railway's PostgreSQL URL!

This means: **Railway's `DATABASE_URL` environment variable is NOT being injected!**

---

## 🔍 ROOT CAUSE:

Railway needs to **link** your backend service to the PostgreSQL service for environment variables to be injected automatically.

---

## ✅ FIX THIS IN RAILWAY DASHBOARD:

### Step 1: Check PostgreSQL Service
1. Go to Railway dashboard
2. Click on your **PostgreSQL** service (separate from backend)
3. Copy the **`DATABASE_URL`** value
   - Should look like: `postgresql://user:pass@host.railway.internal:5432/railway`

### Step 2: Manually Set DATABASE_URL in Backend
1. Click on your **backend service**
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add:
   ```
   Name: DATABASE_URL
   Value: postgresql://postgres.railway.internal:5432/railway?user=postgres&password=XXX
   ```
   (Use the exact value from your PostgreSQL service)

### Step 3: OR Link the Services (Better Method)
1. Click on your **backend service**
2. Go to **"Settings"** tab
3. Scroll to **"Service Variables"**
4. Click **"+ Variable Reference"**
5. Select: **PostgreSQL** service
6. Select variable: **`DATABASE_URL`**
7. Click **"Add"**

This automatically injects the DATABASE_URL!

---

## 🎯 ALTERNATIVE: Set All Variables Manually

Go to Backend → Variables → Add these:

### Required Database Variables:
```bash
DATABASE_URL=postgresql://postgres.railway.internal:5432/railway

# OR use the full URL from PostgreSQL service:
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@postgres.railway.internal:5432/railway
```

### Required Redis Variables:
```bash
REDIS_HOST=redis.railway.internal
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

### Required App Variables:
```bash
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=your-super-secret-key-change-this-min-256-bits
PORT=8080
```

---

## 📋 HOW TO FIND THE CORRECT VALUES:

### Get PostgreSQL URL:
1. Click **PostgreSQL service** in Railway
2. Go to **"Connect"** tab
3. Copy **"DATABASE_URL"** or **"Postgres Connection URL"**

### Get Redis URL:
1. Click **Redis service** in Railway
2. Go to **"Connect"** tab  
3. Copy **"REDIS_URL"** or individual HOST/PORT/PASSWORD

---

## 🔧 WHY THIS HAPPENS:

Railway **does NOT automatically** inject variables between services unless:
1. ✅ Services are explicitly linked
2. ✅ Variables are manually referenced
3. ✅ Or you manually copy-paste the values

---

## ✨ QUICK FIX (Do This Now):

### Method 1: Copy DATABASE_URL Manually
```bash
# In PostgreSQL service, find DATABASE_URL:
postgresql://postgres:XXX@postgres.railway.internal:5432/railway

# Add this EXACT value to backend service variables as DATABASE_URL
```

### Method 2: Use Service Reference
1. Backend → Settings → Service Variables
2. Add Reference → PostgreSQL → DATABASE_URL

---

## 🎯 After Setting Variables:

Railway will auto-redeploy. You should see in logs:
```
✅ HikariPool - Starting...
✅ HikariPool - Start completed
✅ Started ExpenseTrackerApplication
```

Instead of:
```
❌ Connection to localhost:5432 refused
```

---

## 📸 SCREENSHOT GUIDE:

**What you need to do in Railway:**

1. **PostgreSQL Service** → Connect tab → Copy `DATABASE_URL`
2. **Backend Service** → Variables tab → Add `DATABASE_URL` with copied value
3. **Backend Service** → Should auto-redeploy
4. **Check logs** → Should connect successfully!

---

## ⚡ DO THIS RIGHT NOW:

1. Open Railway dashboard
2. Click PostgreSQL service
3. Copy the DATABASE_URL
4. Go to backend service → Variables
5. Add DATABASE_URL with the copied value
6. Add other required variables (JWT_SECRET, SPRING_PROFILES_ACTIVE)
7. Save (auto-redeploys)
8. Watch logs!

---

**This is a Railway configuration issue, not a code issue!** 

The code is correct - we just need to give it the right database URL from Railway! 🎯

