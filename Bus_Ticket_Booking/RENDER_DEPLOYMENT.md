# 🚀 RENDER DEPLOYMENT GUIDE - ROUTEXEN BACKEND

## ⚠️ IMPORTANT: Security & Secrets Management

**DO NOT commit `.env` files to GitHub!** Render will automatically detect and use `render.yaml`.

---

## Step 1: Generate Secure Secrets

Before deployment, generate production-safe secrets:

```bash
# Generate SECRET_KEY
python -c "import secrets; print('SECRET_KEY=', secrets.token_urlsafe(32))"

# Generate ADMIN_PASSWORD
python -c "import secrets; print('ADMIN_PASSWORD=', secrets.token_urlsafe(16))"
```

---

## Step 2: Set Up External Services

### Option A: PostgreSQL (Recommended for free tier)
Use **Neon PostgreSQL** (free, with managed connection pooling):
1. Go to https://console.neon.tech
2. Create account & new project
3. Get pooled connection string (looks like: `postgresql://user:pass@host/db`)
4. Copy connection string, you'll need it later

### Option B: PostgreSQL (Render managed - paid)
- Render will create PostgreSQL automatically via `render.yaml`
- Connection string will be auto-injected

---

### RedisToGo / Upstash (For cache & Celery)
1. Go to https://redis.com/try-free/ OR https://upstash.com
2. Create account & Redis instance
3. Get connection string (format: `redis://default:password@host:port`)

**⚠️ If using free tier Render Redis:** It will purge data after 30 days of inactivity

---

## Step 3: Push Code to GitHub

```bash
cd "d:\New folder\Bus_Ticket_Booking"

# Initialize git if needed
git init
git add .
git commit -m "chore: prepare for Render deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ROUTEXEN.git
git push -u origin main
```

---

## Step 4: Create Render Account & Deploy

### 4.1 Create Render Account
1. Go to https://dashboard.render.com
2. Sign up with GitHub (easiest)
3. Authorize GitHub access

### 4.2 Connect Repository
1. Click **"New"** → **"Web Service"**
2. Select **"Build and deploy from a Git repository"**
3. Choose **ROUTEXEN** repository
4. Click **"Connect"**

### 4.3 Configure for Backend Only
- **Name:** `routexen-backend`
- **Environment:** `Docker`
- **Dockerfile:** `backend/Dockerfile.prod`
- **BuildCommand:** (Leave empty - uses Dockerfile)
- **StartCommand:** (Leave empty - uses Dockerfile CMD)
- **Plan:** `Free` (or Starter for better performance)
- **Region:** `Singapore` (or closest to you)

### 4.4 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** for each:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | `postgresql://user:pass@neon-host/db?sslmode=require` | From Neon |
| `REDIS_URL` | `redis://default:pass@host:port` | From Redis.com |
| `SECRET_KEY` | (Generated above) | Keep secure! |
| `ALGORITHM` | `HS256` | Standard JWT algo |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | 24 hours |
| `CELERY_BROKER_URL` | Same as REDIS_URL | For task queue |
| `CELERY_RESULT_BACKEND` | Same as REDIS_URL | For task results |
| `SMTP_ENABLED` | `True` | Enable email |
| `SMTP_HOST` | `smtp.gmail.com` | Gmail SMTP |
| `SMTP_PORT` | `587` | Standard TLS port |
| `SMTP_USER` | `your-email@gmail.com` | Gmail address |
| `SMTP_PASSWORD` | (16-char Google App Password) | NOT your Gmail password! |
| `SMTP_FROM` | `noreply@routexen.com` | Email sender address |
| `SMTP_USE_TLS` | `True` | Enable TLS encryption |
| `ADMIN_EMAIL` | `admin@yourapp.com` | Initial admin |
| `ADMIN_PASSWORD` | (Generated above) | Change after login! |

---

## Step 5: Create Google App Password (For Email)

1. Go to https://myaccount.google.com/apppasswords
2. Select **"Mail"** and **"Windows Computer"**
3. Google will generate 16-character password
4. Copy and paste into Render as `SMTP_PASSWORD`
5. **Do NOT use your actual Gmail password!**

---

## Step 6: Deploy & Monitor

### Deploy
1. Click **"Deploy"** button in Render Dashboard
2. Render will build and deploy your backend

### Monitor Logs
- Click service name → **"Logs"** tab
- Watch for any startup errors
- If database migration fails, check DATABASE_URL

---

## Step 7: Test Backend

Once deployed, test with:

```bash
# Get your Render URL from dashboard (looks like: https://routexen-backend-xxx.onrender.com)

# Test health endpoint
curl https://routexen-backend-xxx.onrender.com/health

# Check API docs
curl https://routexen-backend-xxx.onrender.com/docs
```

---

## ⚠️ Troubleshooting

### Error: "ModuleNotFoundError: No module named 'app'"
- **Cause:** Wrong WORKDIR in Dockerfile
- **Fix:** Check `backend/Dockerfile.prod` line 10

### Error: "Connection refused" (Redis/Database)
- **Cause:** Connection string format is wrong or service unreachable
- **Fix:** Verify DATABASE_URL and REDIS_URL in environment variables

### Deployment keeps failing
- Click **"Logs"** tab to see actual error
- Check that `requirements.txt` has all dependencies

### Database migration errors
- Manually run migrations (if needed):
  ```bash
  # Via Render Shell (available in dashboard)
  cd /app && alembic upgrade head
  ```

---

## 🔴 Security Checklist

- ✅ Changed `ADMIN_PASSWORD` from default
- ✅ Changed `SECRET_KEY` (NOT "super-secret...")
- ✅ Using Gmail App Password (NOT real Gmail password)
- ✅ `.env` files NOT committed to GitHub
- ✅ REDIS_URL has authentication (if publicly accessible)
- ✅ DATABASE_URL uses SSL/TLS (`?sslmode=require`)

---

## 📋 Next Steps

1. **Add Frontend:** Deploy React app to Netlify/Vercel
2. **Set CORS:** Update `app/main.py` CORS origins to frontend URL
3. **Monitor:** Set up error tracking (Sentry, etc.)
4. **Backup:** Enable database backups in Neon dashboard
5. **Custom Domain:** Add domain in Render → Custom Domain

---

## 💡 Useful Commands

```bash
# SSH into Render shell (from dashboard)
# Run migrations
alembic upgrade head

# Check database
psql $DATABASE_URL

# View Celery tasks
celery -A app.workers.tasks inspect active
```

---

**Deployment successful! 🎉**
