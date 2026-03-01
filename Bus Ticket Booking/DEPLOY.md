# 🚀 Production Deployment Guide — Oracle Cloud VM

Complete step-by-step guide to deploy the Flight Ticket Booking Application to an Oracle Cloud (OCI) Ubuntu VM.

---

## Quick Checklist

- [ ] Create Oracle Cloud VM (Ubuntu 22.04+)
- [ ] Configure OCI Security List (ports 22, 80, 443)
- [ ] Install Docker Engine + Compose
- [ ] Clone repo to VM
- [ ] Create `.env.production` from template
- [ ] Run `docker compose -f docker-compose.prod.yml up -d --build`
- [ ] Verify with `curl http://<PUBLIC_IP>/api/health`
- [ ] Enable systemd auto-start
- [ ] (Optional) Add domain + HTTPS

---

## 1. Oracle Cloud VM Setup

### 1.1 Create the VM

1. Log in to [Oracle Cloud Console](https://cloud.oracle.com)
2. Go to **Compute → Instances → Create Instance**
3. Settings:
   - **Image**: Ubuntu 22.04 (Canonical)
   - **Shape**: `VM.Standard.A1.Flex` (free tier: 4 OCPU, 24 GB RAM) or `VM.Standard.E2.1.Micro` (free tier)
   - **Boot volume**: 50 GB minimum
   - **SSH key**: Upload your public key (e.g., `~/.ssh/id_rsa.pub`)
4. Click **Create** and note the **Public IP Address**

### 1.2 Configure OCI Security List (Firewall)

OCI blocks all inbound traffic by default. You MUST open ports:

1. Go to **Networking → Virtual Cloud Networks → your VCN**
2. Click your **Subnet → Security Lists → Default Security List**
3. Click **Add Ingress Rules** and add:

| Source CIDR    | Protocol | Dest Port | Description |
|----------------|----------|-----------|-------------|
| `0.0.0.0/0`   | TCP      | 80        | HTTP        |
| `0.0.0.0/0`   | TCP      | 443       | HTTPS       |
| `0.0.0.0/0`   | TCP      | 22        | SSH         |

> ⚠️ **This is the #1 reason deployments fail on OCI.** If you skip this, nothing will be accessible even though everything runs fine inside the VM.

### 1.3 Ubuntu UFW (iptables) Rules

Oracle Ubuntu images have `iptables` rules that also block traffic. Run these on the VM:

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

---

## 2. Install Docker Engine + Docker Compose

SSH into your VM:

```bash
ssh -i ~/.ssh/id_rsa ubuntu@<PUBLIC_IP>
```

Install Docker using the **official method**:

```bash
# Update system
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine + Compose plugin
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to docker group (avoids sudo for docker commands)
sudo usermod -aG docker $USER

# Apply group — log out and back in, or run:
newgrp docker

# Verify
docker --version
docker compose version
```

---

## 3. Clone & Configure

### 3.1 Clone the Repository

```bash
cd ~
git clone <YOUR_REPO_URL> flight_booking
cd flight_booking
```

### 3.2 Create Production Environment File

```bash
cp .env.production.example .env.production
nano .env.production
```

Fill in your **real values**:

```env
# PostgreSQL — use a strong password!
POSTGRES_USER=flight_user
POSTGRES_PASSWORD=YourStr0ng_Passw0rd_Here!
POSTGRES_DB=flight_booking_db

# Database URL — password must match above
DATABASE_URL=postgresql+asyncpg://flight_user:YourStr0ng_Passw0rd_Here!@postgres:5432/flight_booking_db

# Redis — service name, not localhost
REDIS_HOST=redis
REDIS_PORT=6379

# JWT — generate a random string: openssl rand -hex 32
SECRET_KEY=paste_your_64_char_random_string_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

> 💡 **Generate a secure SECRET_KEY:**
> ```bash
> openssl rand -hex 32
> ```

---

## 4. Deploy

### 4.1 Build & Start Everything

```bash
cd ~/flight_booking
docker compose -f docker-compose.prod.yml up -d --build
```

This will:
1. Build backend image (uvicorn)
2. Build nginx image (includes frontend build)
3. Pull postgres:16-alpine and redis:7-alpine
4. Start all services in correct order (postgres → redis → backend → celery → nginx)
5. Run SQL init scripts on first postgres startup

### 4.2 Watch Logs (First Time)

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f nginx
docker compose -f docker-compose.prod.yml logs -f postgres
```

### 4.3 Verify

```bash
# Check all containers are running and healthy
docker compose -f docker-compose.prod.yml ps

# Test health endpoint
curl http://localhost/api/health
# Expected: {"status":"ok"}

# Test root API
curl http://localhost/api/
# Expected: {"message":"Flight Booking API is running"}

# Test from outside (use your public IP)
curl http://<PUBLIC_IP>/api/health
```

Open in browser: `http://<PUBLIC_IP>` — you should see the React frontend.

---

## 5. Auto-Start on Boot (systemd)

```bash
# Copy service file
sudo cp deploy/flight-booking.service /etc/systemd/system/

# If your repo is NOT at /home/ubuntu/flight_booking, edit the path:
sudo nano /etc/systemd/system/flight-booking.service
# Change WorkingDirectory to your actual path

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable flight-booking
sudo systemctl start flight-booking

# Check status
sudo systemctl status flight-booking

# View logs
sudo journalctl -u flight-booking -f
```

### Test Auto-Start

```bash
sudo reboot
# Wait 2 minutes, then:
curl http://<PUBLIC_IP>/api/health
```

---

## 6. Access Without Domain (IP Only)

Your app is accessible at:

| URL | What |
|-----|------|
| `http://<PUBLIC_IP>` | React frontend |
| `http://<PUBLIC_IP>/api/health` | Health check |
| `http://<PUBLIC_IP>/api/flights?from=MAA&to=DEL&date=2026-03-01` | API test |

The frontend `API_BASE = '/api'` uses **relative paths**, so it automatically works with any IP or domain — no configuration needed.

---

## 7. Domain + HTTPS (Optional but Recommended)

### 7.1 Point Domain to VM

1. Go to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.)
2. Add an **A Record**:
   - **Host**: `@` (or subdomain like `booking`)
   - **Value**: `<PUBLIC_IP>`
   - **TTL**: 300
3. Wait for DNS propagation (5–30 minutes)
4. Verify: `ping yourdomain.com`

### 7.2 Update Nginx for Domain

Edit `nginx/nginx.conf`, change:

```nginx
server_name _;
```

to:

```nginx
server_name yourdomain.com www.yourdomain.com;
```

Rebuild nginx:

```bash
docker compose -f docker-compose.prod.yml up -d --build nginx
```

### 7.3 Install HTTPS with Certbot

```bash
# Install certbot
sudo apt-get install -y certbot

# Stop nginx temporarily (certbot needs port 80)
docker compose -f docker-compose.prod.yml stop nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Restart nginx
docker compose -f docker-compose.prod.yml start nginx
```

Certificates are saved to `/etc/letsencrypt/live/yourdomain.com/`.

### 7.4 Configure Nginx for HTTPS

Update `nginx/nginx.conf`:

```nginx
# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # ... rest of your config (root, location blocks, etc.)
}
```

Add the certificate volume to `docker-compose.prod.yml` under the nginx service:

```yaml
nginx:
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt:ro
```

Rebuild:

```bash
docker compose -f docker-compose.prod.yml up -d --build nginx
```

### 7.5 Auto-Renew Certificate

```bash
# Test auto-renew
sudo certbot renew --dry-run

# Add cron job for auto-renewal
sudo crontab -e
# Add this line:
0 3 * * * certbot renew --quiet --pre-hook "docker compose -f /home/ubuntu/flight_booking/docker-compose.prod.yml stop nginx" --post-hook "docker compose -f /home/ubuntu/flight_booking/docker-compose.prod.yml start nginx"
```

---

## 8. Useful Commands

### Container Management

```bash
# Start all services
docker compose -f docker-compose.prod.yml up -d

# Stop all services
docker compose -f docker-compose.prod.yml down

# Rebuild and restart (after code changes)
docker compose -f docker-compose.prod.yml up -d --build

# Restart a single service
docker compose -f docker-compose.prod.yml restart backend

# View running containers
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f celery-worker
```

### Database

```bash
# Connect to PostgreSQL
docker exec -it flight_postgres_prod psql -U flight_user -d flight_booking_db

# Dump database
docker exec flight_postgres_prod pg_dump -U flight_user flight_booking_db > backup.sql

# Restore database
cat backup.sql | docker exec -i flight_postgres_prod psql -U flight_user -d flight_booking_db
```

### Debug

```bash
# Check what's listening on port 80
sudo ss -tlnp | grep 80

# Test backend directly (from inside the VM)
docker exec flight_backend_prod curl -s http://localhost:8000/health

# Check Redis
docker exec flight_redis_prod redis-cli ping

# Check disk space
df -h

# Check memory
free -m

# Check Docker resource usage
docker stats --no-stream
```

---

## 9. Troubleshooting

### ❌ Can't access `http://<PUBLIC_IP>` from browser

1. **OCI Security List** — did you add ingress rules for ports 80/443? (Section 1.2)
2. **Ubuntu iptables** — did you run the iptables commands? (Section 1.3)
3. **Nginx running?** — `docker compose -f docker-compose.prod.yml ps nginx`
4. **Port 80 listening?** — `sudo ss -tlnp | grep 80`

### ❌ Frontend loads but API calls fail (CORS / Network Error)

1. Frontend uses `/api` (relative), so it should work with any host
2. Check nginx is proxying: `curl http://localhost/api/health`
3. Check CORS in `main.py` — `allow_origins=["*"]` should work for all origins
4. Check browser DevTools → Network tab for the actual error

### ❌ Database connection refused

1. Check postgres is healthy: `docker compose -f docker-compose.prod.yml ps postgres`
2. Ensure `DATABASE_URL` uses `postgres` (service name), NOT `localhost`
3. Check postgres logs: `docker compose -f docker-compose.prod.yml logs postgres`
4. Verify user/password match between `POSTGRES_USER`/`POSTGRES_PASSWORD` and `DATABASE_URL`

### ❌ Redis connection refused

1. Ensure `REDIS_HOST=redis` (service name), NOT `localhost`
2. Check: `docker exec flight_redis_prod redis-cli ping` → should return `PONG`

### ❌ Celery not processing tasks

1. Check worker logs: `docker compose -f docker-compose.prod.yml logs celery-worker`
2. Ensure Redis is running
3. In worker logs, look for `[tasks]` list — should show your registered tasks

### ❌ Emails not sending

1. Check celery-worker logs for SMTP errors
2. Ensure `SMTP_PASS` is a **Gmail App Password** (not your regular password)
3. To generate: Google Account → Security → 2FA → App Passwords
4. Test: `docker compose -f docker-compose.prod.yml logs celery-worker | grep -i email`

### ❌ Containers keep restarting

```bash
# Check which container is failing
docker compose -f docker-compose.prod.yml ps

# Check its logs
docker compose -f docker-compose.prod.yml logs <service-name>
```

### ❌ Database lost data after `docker compose down`

- `docker compose down` preserves the `pgdata` volume ✅
- `docker compose down -v` **DELETES** volumes ❌ — never use `-v` in production!

---

## 10. Update / Redeploy

When you push code changes:

```bash
cd ~/flight_booking
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

To reset the database (⚠️ destroys all data):

```bash
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d --build
```
