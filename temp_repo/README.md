# ✈️ Flight Ticket Booking System

A production-ready full-stack flight booking platform built using FastAPI + React, containerized with Docker, and powered by PostgreSQL, Redis, Celery, and Nginx.

This system demonstrates scalable backend architecture, asynchronous processing, and production deployment practices.

---

## 🚀 Features

- 🔐 JWT-based User Authentication
- 🔎 Flight Search (Origin, Destination, Date)
- 💺 Real-time Seat Hold (Redis – 10 minute lock)
- 🎫 Booking Confirmation System
- 📧 Automated Email Confirmation (Celery + Gmail SMTP)
- 🐳 Fully Dockerized Production Setup

---

## 🏗 Tech Stack

Backend: FastAPI, SQLAlchemy  
Frontend: React + Vite  
Database: PostgreSQL  
Cache: Redis  
Background Tasks: Celery  
Reverse Proxy: Nginx  
Containerization: Docker + Docker Compose  

---

## ⚠️ Important Note (Demo Data)

This project uses pre-seeded demo flight data. Only the routes and dates listed below will return results.

### Available Dates

| Date | Format for UI |
|------|--------------|
| 01-03-2026 | **2026-03-01** |
| 02-03-2026 | **2026-03-02** |
| 03-03-2026 | **2026-03-03** |
| 04-03-2026 | **2026-03-04** |
| 05-03-2026 | **2026-03-05** |
| 06-03-2026 | **2026-03-06** |

> **Note:** March 1 & 2 have a subset of routes. March 3–6 have all 25 routes below.

### Available Flight Routes (25)

| # | From | To | Airlines |
|---|------|----|----------|
| 1 | Chennai | Delhi | IndiGo, Air India, Vistara, SpiceJet |
| 2 | Delhi | Mumbai | IndiGo, Air India, Vistara |
| 3 | Mumbai | Bangalore | IndiGo, SpiceJet, Air India |
| 4 | Bangalore | Hyderabad | IndiGo, Vistara |
| 5 | Delhi | Kolkata | Air India, Go First |
| 6 | Bangalore | Goa | SpiceJet, AirAsia India |
| 7 | Delhi | Chennai | IndiGo, Air India |
| 8 | Mumbai | Delhi | Vistara, IndiGo |
| 9 | Bangalore | Mumbai | SpiceJet, IndiGo |
| 10 | Hyderabad | Bangalore | AirAsia India |
| 11 | Kolkata | Delhi | Air India |
| 12 | Goa | Bangalore | SpiceJet |
| 13 | Delhi | Bangalore | Air India, Vistara |
| 14 | Chennai | Mumbai | IndiGo, Air India |
| 15 | Delhi | Goa | IndiGo, AirAsia India |
| 16 | Chennai | Bangalore | IndiGo, Vistara |
| 17 | Hyderabad | Delhi | Go First, Air India |
| 18 | Mumbai | Goa | IndiGo, SpiceJet |
| 19 | Delhi | Jaipur | IndiGo, Go First |
| 20 | Jaipur | Delhi | IndiGo |
| 21 | Mumbai | Kochi | Air India |
| 22 | Chennai | Kochi | AirAsia India |
| 23 | Delhi | Ahmedabad | SpiceJet |
| 24 | Bangalore | Pune | IndiGo |
| 25 | Kolkata | Guwahati | AirAsia India |

⚠️ If any other route or date is selected, the system will display "No flights found."

---

## 📂 Project Structure

Flight_ticket_booking/
│
├── backend/
├── frontend/
├── nginx/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.production.example
└── README.md

---

# 🐳 Running the Project 

## 1️⃣ Prerequisites

Install:
- Docker Desktop
- Git

---

## 2️⃣ Clone the Repository

git clone "https://github.com/elango8/Flight_ticket_booking"  
cd Flight_ticket_booking

---

## 3️⃣ Configure Environment Variables

Create production environment file:

cp .env.production.example .env.production

Open `.env.production` and update values:

--------------------------------------------------
# DATABASE
POSTGRES_DB=flightdb
POSTGRES_USER=flightuser
POSTGRES_PASSWORD=flightpass

# REDIS
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
SECRET_KEY=your_super_secret_key

# SMTP CONFIG (GMAIL)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=skybookofficial0@gmail.com
SMTP_PASS=YOUR_16_DIGIT_APP_PASSWORD

--------------------------------------------------

⚠️ Do NOT hardcode passwords inside code.  
All secrets must be set in `.env.production`.

---

# 📧 Gmail App Password Setup (Required for Email)

1. Login to skybookofficial0@gmail.com  
2. Go to Google Account → Security  
3. Enable 2-Step Verification  
4. Search for “App Passwords”  
5. Select App: Mail  
6. Generate password  
7. Copy the 16-digit password  
8. Paste into:

SMTP_PASS=your_generated_password  

⚠️ Do NOT use your Gmail login password.

---

## 4️⃣ Start Production Containers

docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build  

Check container status:

docker compose -f docker-compose.prod.yml ps  

All services should show **Up** and **Healthy**.

---

# 🌍 Access the Application

http://localhost/


# Seed scripts run only on first DB creation.
# If you ran the project before and want to reload demo data, reset the database volume using:

docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build


# 🧪 How to Test the System

1. Register a new user  
2. Search using any of the 25 routes above with dates **2026-03-01** to **2026-03-06**. Examples:

   - Chennai → Delhi on 2026-03-03
   - Delhi → Goa on 2026-03-05
   - Mumbai → Bangalore on 2026-03-04
   - Delhi → Jaipur on 2026-03-06

3. Select flight  
4. Select seat  
5. Complete booking  
6. Email confirmation will be sent automatically  

If email is not received, check Celery logs:

docker logs -f flight_celery_worker_prod

---

# 🛑 Stop the Application

docker compose -f docker-compose.prod.yml down --remove-orphans

---

# 🔄 Database Migration (If Required)

docker compose exec backend alembic upgrade head

---

# 🧠 System Architecture

User → Nginx → FastAPI → PostgreSQL  
                        ↓  
                      Redis (Seat Hold - 10 min lock)  
                        ↓  
                      Celery (Email Background Task)

---

# 🏆 Production Highlights

- Environment-based configuration
- No hardcoded secrets
- Background job processing
- Redis seat locking system
- Docker network isolation
- Health checks enabled
- Reverse proxy architecture
- Scalable container-based deployment

---

# 🎯 What This Project Demonstrates

- Full-stack application development
- Secure authentication system
- Asynchronous background processing
- Scalable infrastructure design
- Docker-based deployment
- Real-world booking workflow simulation

---

