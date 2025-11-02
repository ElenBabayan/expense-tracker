# 🔧 CRASH FIX - "Application failed to respond"

## Problem:
Railway expects the app to listen on the `$PORT` environment variable, but our app was hardcoded to port 8080.

## ✅ Fixes Applied:

### 1. **Updated Dockerfile** 
Changed the ENTRYPOINT to use Railway's `$PORT` variable:
```dockerfile
-Dserver.port=${PORT:-8080}
```
This makes the app listen on Railway's assigned port (defaults to 8080 locally).

### 2. **Updated railway.json**
- Added healthcheck path: `/api/actuator/health`
- Increased healthcheck timeout to 300 seconds
- Removed conflicting startCommand

### 3. **Already configured in application-prod.yml**
```yaml
server:
  port: ${PORT:8080}
```
This reads the PORT variable from Railway.

---

## 🚀 Deploy Fixed Version:

```bash
cd /Users/ebabayan/dev/expense-tracker

# Add the fixes
git add Dockerfile railway.json

# Commit
git commit -m "Fix Railway port configuration"

# Push (Railway will auto-redeploy)
git push
```

---

## 🔍 What to Check in Railway:

After pushing:

### 1. Check Build Logs
- Should complete successfully
- Look for "BUILD SUCCESSFUL"

### 2. Check Deploy Logs  
- Should see: "Started ExpenseTrackerApplication"
- Should see: "Tomcat started on port(s): XXXX"
- Should NOT crash anymore!

### 3. Test the Health Check
Once deployed, test:
```bash
curl https://your-app.railway.app/api/actuator/health
```

Should return:
```json
{"status":"UP"}
```

---

## ⚠️ Important Railway Settings:

Make sure these environment variables are set in Railway dashboard:

### Required Variables:
```bash
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=your-super-secret-key-min-256-bits-change-this-production-secret
```

### Auto-provided by Railway (from PostgreSQL service):
```bash
DATABASE_URL
PGUSER
PGPASSWORD
PGHOST
PGPORT
PGDATABASE
```

### Auto-provided by Railway (from Redis service):
```bash
REDIS_HOST
REDIS_PORT  
REDIS_PASSWORD
REDIS_URL
```

### Optional (add after successful deployment):
```bash
FRONTEND_URL=http://localhost:3000
```

---

## 📊 Expected Flow:

1. ✅ Build completes (Docker image created)
2. ✅ Container starts
3. ✅ App listens on Railway's PORT
4. ✅ Healthcheck succeeds at `/api/actuator/health`
5. ✅ Status changes to "Active" 🎉

---

## 🐛 If Still Crashing:

### Check Deploy Logs for:
1. **Database connection errors**
   - Verify PostgreSQL service is running
   - Check DATABASE_URL is set

2. **Redis connection errors**
   - Verify Redis service is running
   - Check REDIS_HOST, REDIS_PORT are set

3. **Port binding errors**
   - Should now be fixed with PORT variable

4. **Missing environment variables**
   - Add JWT_SECRET
   - Add SPRING_PROFILES_ACTIVE=prod

---

## 💡 Quick Test After Deployment:

```bash
# Replace with your Railway domain
BACKEND_URL="https://your-app.railway.app"

# Test health check
curl $BACKEND_URL/api/actuator/health

# Test registration
curl -X POST $BACKEND_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "firstName": "Test",
    "lastName": "User"
  }'
```

---

## ✅ Push Now:

```bash
git add .
git commit -m "Fix Railway deployment - port configuration"
git push
```

**Then watch Railway dashboard - should succeed this time!** 🎉

