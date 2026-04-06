# 🎯 RENDER DEPLOYMENT - QUICK COMMAND REFERENCE

## 🔑 Generate Required Secrets

```bash
# Generate SECRET_KEY (32-char secure random)
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Generate ADMIN_PASSWORD (16-char secure random)
python -c "import secrets; print(secrets.token_urlsafe(16))"

# Generate in PowerShell (Windows)
$([Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object { [char](Get-Random -Minimum 33 -Maximum 126) }) -join '')))
```

---

## 📊 Environment Variables Template

```bash
# Copy and fill with your actual values:

DATABASE_URL=postgresql://user:PASSWORD@ep-xxxx-region.neon.tech/neondb?sslmode=require
REDIS_URL=redis://default:PASSWORD@hostname:port
SECRET_KEY=<generated_secret_key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CELERY_BROKER_URL=redis://default:PASSWORD@hostname:port
CELERY_RESULT_BACKEND=redis://default:PASSWORD@hostname:port
SMTP_ENABLED=True
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
SMTP_FROM=noreply@routexen.com
SMTP_USE_TLS=True
ADMIN_EMAIL=admin@yourapp.com
ADMIN_PASSWORD=<generated_admin_password>
```

---

## 🚀 Deployment Commands

### Push to GitHub
```bash
cd "d:\New folder\Bus_Ticket_Booking"
git add .
git commit -m "chore: prepare for Render deployment"
git push origin main
```

### Test Locally with Docker
```bash
# Build backend image
docker build -f backend/Dockerfile.prod -t routexen-backend:latest ./backend

# Run container
docker run -p 8000:8000 \
  -e DATABASE_URL="sqlite:///./test.db" \
  -e REDIS_URL="redis://localhost:6379/0" \
  -e SECRET_KEY="test-key" \
  routexen-backend:latest
```

---

## 🧪 Testing After Deployment

### Basic Health Checks
```bash
# Replace with your actual Render URL
BACKEND_URL="https://routexen-backend-xxx.onrender.com"

# Get health status
curl $BACKEND_URL/

# View API documentation
curl $BACKEND_URL/docs

# View ReDoc documentation
curl $BACKEND_URL/redoc
```

### Test Endpoints
```bash
# Get all buses
curl $BACKEND_URL/buses

# Get health with more details
curl -X GET "$BACKEND_URL/" -H "accept: application/json"

# Check database connection
curl -X GET "$BACKEND_URL/buses?page=1&limit=10"
```

---

## 🐛 Debugging

### View Live Logs
```bash
# Via Render Dashboard:
# 1. Go to https://dashboard.render.com
# 2. Click your service
# 3. Click "Logs" tab
# 4. Watch real-time logs
```

### SSH into Render Shell
```bash
# Via Render Dashboard:
# 1. Click service
# 2. Click "Shell" tab
# 3. Run commands:

# Check running processes
ps aux | grep uvicorn

# Check database connection
python -c "from app.core.config import settings; print(settings.DATABASE_URL)"

# Run migrations manually
cd /app && alembic upgrade head

# Check Redis connection
redis-cli -u $REDIS_URL ping
```

---

## 📝 Environment Variable Setup Checklist

```bash
# Neon PostgreSQL Connection String
# 1. Go to https://console.neon.tech
# 2. Select project → Connection string
# 3. Copy pooled connection
# Format: postgresql://user:pass@host.neon.tech/db?sslmode=require

# Redis Connection String
# 1. Go to https://redis.com/try-free/
# 2. Create Redis instance
# 3. Copy "Default user" connection string
# Format: redis://default:pass@hostname:port

# Gmail App Password
# 1. Go to https://myaccount.google.com/apppasswords
# 2. Select: Mail + Windows Computer
# 3. Copy 16-character password (no spaces)
```

---

## 🔍 Common Issues & Fixes

### "ModuleNotFoundError: No module named 'app'"
```bash
# Fix: Check Dockerfile.prod WORKDIR
# Should be: WORKDIR /app
# Check: backend/Dockerfile.prod line 10
```

### "Connection refused" Database Error
```bash
# Fix: Verify DATABASE_URL format
# Should include: ?sslmode=require
# Example: postgresql://user:pass@host/db?sslmode=require
```

### "Connection refused" Redis Error
```bash
# Fix: Verify REDIS_URL format
# Should be: redis://default:password@host:port
# Test: redis-cli -u $REDIS_URL ping
```

### Build Fails with "pip install failed"
```bash
# Fix: Check requirements.txt compatibility
# Ensure all packages support Python 3.11
# Test locally: pip install -r requirements.txt
```

### Migrations Not Running
```bash
# Fix: SSH into Render shell and run manually:
cd /app && alembic upgrade head
```

---

## 📊 Monitoring Commands

### Check Service Status
```bash
# Via Render Dashboard:
curl https://api.render.com/v1/services | jq '.services[] | select(.name=="routexen-backend-prod")'
```

### View Deployment History
```bash
# Via Render Dashboard:
# Service → Deployments tab
# Shows all deployment attempts and logs
```

### Monitor CPU/Memory
```bash
# Via Render Dashboard:
# Service → Metrics tab
# Shows real-time resource usage
```

---

## 🚨 Emergency Recovery

### Rollback to Previous Version
```bash
# Via Render Dashboard:
# 1. Go to service → Deployments
# 2. Click on previous deployment
# 3. Click "Redeploy"
```

### Clear Redis Cache (if needed)
```bash
# Via CLI (if you have access):
redis-cli -u $REDIS_URL FLUSHALL

# Warning: This clears ALL data in Redis!
```

### Force Restart Service
```bash
# Via Render Dashboard:
# 1. Click service
# 2. Click "..." menu
# 3. Click "Restart service"
```

---

## 📚 Useful Links

| Resource | URL |
|----------|-----|
| Render Dashboard | https://dashboard.render.com |
| Neon PostgreSQL | https://console.neon.tech |
| Redis.com | https://redis.com/try-free/ |
| Gmail App Password | https://myaccount.google.com/apppasswords |
| FastAPI Docs | https://fastapi.tiangolo.com |
| Docker Docs | https://docs.docker.com |
| Render Docs | https://render.com/docs |

---

## ⏱️ Typical Deployment Timeline

```
5-10 mins    - Generate secrets
10-15 mins   - Set up Postgres (Neon sign-up)
5-10 mins    - Set up Redis
2-3 mins     - Get Gmail App Password
5 mins       - Create Render account
5 mins       - Connect GitHub
5 mins       - Add environment variables
1 min        - Click Deploy
10-15 mins   - Build and deploy process
2-3 mins     - Test endpoints
────────────
~1 hour      - Total time to production!
```

---

## ✅ Deployment Complete Checklist

- [ ] Secrets generated and secure
- [ ] Neon PostgreSQL account created
- [ ] Redis account created
- [ ] Gmail App Password created
- [ ] GitHub repository connected to Render
- [ ] All environment variables added to Render
- [ ] Deployment succeeded (no build errors)
- [ ] Health endpoint responding
- [ ] API docs accessible
- [ ] Database connection working
- [ ] Celery workers running
- [ ] Email service configured
- [ ] Admin account logged in and password changed
- [ ] CORS origins restricted (if needed)
- [ ] Monitoring/logging configured

---

**You're live! 🎉**

Need help? Check RENDER_DEPLOYMENT.md for detailed troubleshooting.
