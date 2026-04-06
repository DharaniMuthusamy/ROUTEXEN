# ✅ PRE-DEPLOYMENT CHECKLIST - ROUTEXEN BACKEND

## 📋 Code Quality Checks

- [x] ✅ Dockerfile.prod - Fixed module path (`app.main:app`)
- [x] ✅ requirements.txt - All dependencies present
- [x] ✅ app/main.py - FastAPI configured correctly
- [x] ✅ Models imported - SQLAlchemy tables created
- [x] ✅ CORS configured - Allow all origins (⚠️ restrict in production)
- [x] ✅ Health check endpoint - Available at `/`

---

## 🔐 Security Checklist

### Environment Variables
- [ ] Generate `SECRET_KEY` (not "super-secret...")
- [ ] Generate `ADMIN_PASSWORD` (not "admin123")
- [ ] Create Gmail App Password (not real Gmail password)
- [ ] Update `SMTP_USER` to real Gmail address
- [ ] Update `ADMIN_EMAIL` to your email

### Database & Redis
- [ ] Sign up for Neon PostgreSQL (https://console.neon.tech)
- [ ] Get pooled connection string (with `?sslmode=require`)
- [ ] Sign up for Redis.com or Upstash (https://redis.com/try-free/)
- [ ] Get Redis connection string with authentication

### GitHub Setup
- [ ] Add `.env` to `.gitignore` (prevent accidental commits)
- [ ] Push code to GitHub (main branch)
- [ ] Verify no `.env` files are committed

---

## 🚀 Render Setup

### Account & Repository
- [ ] Create Render account (https://dashboard.render.com)
- [ ] Connect GitHub repository
- [ ] Select `Bus_Ticket_Booking` repository

### Backend Service Configuration
- [ ] Name: `routexen-backend`
- [ ] Runtime: `Docker`
- [ ] Dockerfile: `backend/Dockerfile.prod`
- [ ] Region: `singapore` (or your closest)
- [ ] Plan: `free` (or `starter` for better performance)

### Environment Variables (Add in Render)
- [ ] `DATABASE_URL` - from Neon
- [ ] `REDIS_URL` - from Redis.com/Upstash
- [ ] `SECRET_KEY` - generated secure key
- [ ] `ALGORITHM` - HS256
- [ ] `ACCESS_TOKEN_EXPIRE_MINUTES` - 1440
- [ ] `CELERY_BROKER_URL` - same as REDIS_URL
- [ ] `CELERY_RESULT_BACKEND` - same as REDIS_URL
- [ ] `SMTP_ENABLED` - True
- [ ] `SMTP_HOST` - smtp.gmail.com
- [ ] `SMTP_PORT` - 587
- [ ] `SMTP_USER` - your-email@gmail.com
- [ ] `SMTP_PASSWORD` - 16-char Google App Password
- [ ] `SMTP_FROM` - noreply@routexen.com
- [ ] `SMTP_USE_TLS` - True
- [ ] `ADMIN_EMAIL` - admin@yourapp.com
- [ ] `ADMIN_PASSWORD` - secure password

---

## 🧪 Testing After Deployment

### Health & Status
- [ ] GET `https://routexen-backend-xxx.onrender.com/` → `{"status": "ok"}`
- [ ] GET `https://routexen-backend-xxx.onrender.com/docs` → Swagger UI loads
- [ ] GET `https://routexen-backend-xxx.onrender.com/redoc` → ReDoc loads

### Database Connection
```bash
# Test database connection (replace URL with your actual URL)
curl -X GET "https://routexen-backend-xxx.onrender.com/buses"
```
- [ ] Should return JSON (not 500 error)

### Email Service
- [ ] Check Render logs for email tests
- [ ] Verify SMTP connection successful

---

## ⚠️ CORS Security (IMPORTANT)

### Current Configuration (Development)
```python
allow_origins=["*"]  # Allow ALL origins
```

### For Production: Restrict to Your Frontend
```python
allow_origins=[
    "https://yourdomain.com",
    "https://www.yourdomain.com",
    "https://app.yourdomain.com"
]
```

**Action:** After frontend is deployed, update `app/main.py` line 22

---

## 🐛 Troubleshooting Commands

### View Logs (in Render Dashboard)
```
1. Go to your service
2. Click "Logs" tab
3. Watch for deployment errors
```

### SSH into Render Shell
```bash
# Available in Render dashboard under "Connect"
# Run migrations manually if needed:
cd /app && alembic upgrade head
```

### Test Email (if SMTP enabled)
```bash
# Via Python shell
from app.services.email_service import send_email
send_email("test@example.com", "Test Subject", "Test body")
```

---

## 📋 Deployment Order

1. **Prepare Environment**
   - Generate secrets
   - Set up Neon PostgreSQL
   - Set up Redis
   - Create Google App Password

2. **Configure Render**
   - Create Render account
   - Connect GitHub
   - Add service configuration
   - Add all environment variables

3. **Deploy**
   - Click "Deploy" button
   - Monitor logs
   - Test endpoints

4. **Post-Deployment**
   - Change admin password (via API if available)
   - Update CORS origins
   - Set up monitoring
   - Configure backups

---

## 🎯 Final Verification

```bash
# After deployment goes live:

# 1. Health check
curl https://routexen-backend-xxx.onrender.com/

# 2. API documentation
curl https://routexen-backend-xxx.onrender.com/docs

# 3. Test database connection
curl https://routexen-backend-xxx.onrender.com/buses

# 4. Monitor logs
# Go to Render dashboard and watch logs for errors
```

---

## 📞 Need Help?

- Email errors? Check `SMTP_PASSWORD` (must be 16-char Google App Password)
- Database errors? Verify `DATABASE_URL` format and connectivity
- Redis errors? Check `REDIS_URL` and network access
- Module errors? Check `Dockerfile.prod` and ensure `app/main.py` exists

See **RENDER_DEPLOYMENT.md** for detailed troubleshooting.

---

## ✨ You're Ready!

Once all checks are complete:
1. Push to GitHub: `git push origin main`
2. Go to Render Dashboard
3. Click "Deploy"
4. Monitor logs
5. Test endpoints
6. 🎉 You're live!

**Good luck! 🚀**
