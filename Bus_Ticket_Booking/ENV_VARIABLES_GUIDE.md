# RENDER ENV VARIABLES - QUICK SETUP GUIDE

## 🔑 Step-by-Step: Where to Get Each Variable

### 1. DATABASE_URL (PostgreSQL)

**Option A: Neon (Recommended - Free)**
```
1. Go to https://console.neon.tech
2. Sign up → Create project
3. Copy "Pooled Connection" string
4. Settings → Connection string
5. Format: postgresql://user:password@host/dbname?sslmode=require
```

**Option B: Render PostgreSQL (Paid)**
- Render will auto-generate via render.yaml

---

### 2. REDIS_URL

**Option A: Redis.com (Free)**
```
1. Go to https://redis.com/try-free/
2. Sign up → Create database
3. Copy connection string from "Redis Stack"
4. Format: redis://default:password@hostname:port
```

**Option B: Upstash (Free)**
```
1. Go to https://upstash.com
2. Free tier: 10,000 commands/day, auto-expires after 30 days
3. Format: redis://default:password@hostname:port
```

---

### 3. SECRET_KEY (JWT Secret)

**Generate in terminal:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Output example:
```
AbCdEfGhIjKlMnOpQrStUvWxYz1234567890_-
```

---

### 4. ADMIN_PASSWORD

**Generate in terminal:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(16))"
```

Output example:
```
xYz1234567890_-AbCdE
```

---

### 5. SMTP_PASSWORD (Gmail 16-char App Password)

**Get from Google:**
```
1. Go to https://myaccount.google.com/apppasswords
2. Select: Mail + Windows Computer (or your OS)
3. Google generates 16-character password
4. Copy: abcd efgh ijkl mnop (without spaces, so: abcdefghijklmnop)
```

⚠️ **NOT your Gmail password! It's a special app-only password**

---

## 📋 Environment Variables Checklist

Copy this template and fill in your values:

```
DATABASE_URL=postgresql://user:NEON_PASSWORD@ep-xxxx-region.neon.tech/neondb?sslmode=require
REDIS_URL=redis://default:REDIS_PASSWORD@hostname:port
SECRET_KEY=<your_generated_secret_key_here>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CELERY_BROKER_URL=redis://default:REDIS_PASSWORD@hostname:port
CELERY_RESULT_BACKEND=redis://default:REDIS_PASSWORD@hostname:port
SMTP_ENABLED=True
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
SMTP_FROM=noreply@routexen.com
SMTP_USE_TLS=True
ADMIN_EMAIL=admin@routexen.com
ADMIN_PASSWORD=<your_generated_admin_password_here>
```

---

## 🚀 Adding to Render

### Via Dashboard:
1. Log in → https://dashboard.render.com
2. Select your service → Settings → Environment
3. Click "Add Environment Variable"
4. Fill in KEY and VALUE
5. Click Save

### Via render.yaml:
- Already configured! Just fill in `sync: false` variables in dashboard

---

## ✅ Verification After Deployment

```bash
# Your backend URL (from Render dashboard)
BACKEND_URL=https://routexen-backend-xxx.onrender.com

# Test health
curl $BACKEND_URL/health

# View API docs
curl $BACKEND_URL/docs

# Check email config
curl -X POST $BACKEND_URL/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

## 🚨 DO NOT DO

❌ Commit `.env` files to GitHub
❌ Use real Gmail password (use App Password)
❌ Share SECRET_KEY with anyone
❌ Use weak passwords like "admin123"
❌ Push with `--force` to main branch

---

## 💡 Pro Tips

1. **Store passwords safely:** Use password manager (1Password, LastPass)
2. **Rotate secrets:** Change SECRET_KEY every 3 months
3. **Monitor logs:** Check Render dashboard for deployment errors
4. **Backup database:** Enable in Neon console
5. **Test locally first:** `docker-compose -f docker-compose.prod.yml up`

---

Ready? Follow RENDER_DEPLOYMENT.md for complete setup! 🚀
