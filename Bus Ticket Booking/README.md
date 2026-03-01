# 🚌 RouteXen — Smart Bus Ticket Booking System

A complete full-stack bus ticket booking application built with **FastAPI**, **React**, **PostgreSQL**, **Redis**, and **Celery**.

---

## 🏗️ Tech Stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Backend     | Python · FastAPI · Uvicorn           |
| ORM         | SQLAlchemy · Alembic migrations      |
| Database    | PostgreSQL 15                        |
| Cache/Queue | Redis 7 · Celery                     |
| Frontend    | React 18 · Vanilla CSS · Axios       |
| Auth        | JWT (python-jose) · bcrypt           |
| DevOps      | Docker · Docker Compose              |

---

## 🚀 Quick Start (Docker)

### Prerequisites
- [Docker](https://www.docker.com/get-started/) and Docker Compose installed

### Run the application

```bash
# Clone and enter project directory
cd "Bus Ticket Booking"

# Build and start all services
docker-compose up --build

# (Optional) Seed data is loaded automatically on first run
```

> Services:
> - **Frontend**: http://localhost:3000
> - **Backend API**: http://localhost:8000
> - **API Docs**: http://localhost:8000/docs

---

## 👤 Demo Credentials

| Role  | Email                   | Password    |
|-------|-------------------------|-------------|
| Admin | admin@routexen.com      | admin123    |
| User  | arjun@example.com       | pass1234    |
| User  | priya@example.com       | pass1234    |

---

## 📁 Project Structure

```
Bus Ticket Booking/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── core/
│   │   │   ├── config.py        # Settings (from .env)
│   │   │   ├── security.py      # JWT + bcrypt
│   │   │   └── dependencies.py  # Auth dependencies
│   │   ├── db/
│   │   │   ├── database.py      # SQLAlchemy engine + session
│   │   │   └── redis_client.py  # Redis client singleton
│   │   ├── models/              # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── bus.py
│   │   │   ├── booking.py
│   │   │   ├── payment.py
│   │   │   └── notification.py
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── routes/              # FastAPI routers
│   │   │   ├── auth.py          # Register / Login
│   │   │   ├── buses.py         # Search, list, seat layout
│   │   │   ├── bookings.py      # Lock, book, cancel
│   │   │   ├── payments.py      # Simulated payment
│   │   │   ├── notifications.py # User notifications
│   │   │   └── reports.py       # Admin reports
│   │   ├── services/
│   │   │   ├── seat_lock_service.py  # Redis SET NX EX locking
│   │   │   └── email_service.py     # Console email simulation
│   │   └── workers/
│   │       └── tasks.py         # Celery confirm_booking task
│   ├── alembic/                 # Database migrations
│   ├── seed.py                  # Sample data loader
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── App.js               # Router + protected routes
│   │   ├── index.css            # Global design system
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   ├── SeatSelectionPage.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── ConfirmationPage.jsx
│   │   │   ├── MyBookingsPage.jsx
│   │   │   └── AdminCreateBusPage.jsx
│   │   └── services/
│   │       └── api.js           # Axios client with JWT interceptor
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## 🔑 Core Features

### 1. Authentication
- JWT-based login and registration
- bcrypt password hashing
- Protected and admin-only routes

### 2. Bus Management
- Admin creates bus trips via UI or API
- Public search by city + date
- Real-time seat availability count

### 3. Seat Booking with Redis Locking
```
SET lock:bus:{bus_id}:seat:{seat_number} {user_id} EX 120 NX
```
- 2-minute seat lock prevents double booking
- Lock released automatically or after payment

### 4. Simulated Payment
- Choose Credit Card, UPI, or Net Banking
- Payment always succeeds (simulation)
- Fires Celery background task after payment

### 5. Celery Background Worker
- Waits 3–5 seconds (simulated processing)
- Updates booking status to CONFIRMED
- Sends console email notifications
- Creates notification record in DB

### 6. Email Simulation
Emails printed to console (Celery worker logs):
```
📧 EMAIL NOTIFICATION (simulated)
  TO      : user@example.com
  SUBJECT : RouteXen – Booking Confirmed #42
```

### 7. Notifications
- UI polls `/api/notifications/` after booking
- Shows confirmation message when Celery task completes

### 8. Admin Reports
```
GET /api/reports/summary        # Total bookings + revenue
GET /api/reports/bus-wise       # Bus-wise breakdown
GET /api/reports/user-history/{user_id}
```

---

## 🌐 API Reference

### Auth
| Method | Endpoint             | Description     |
|--------|---------------------|-----------------|
| POST   | `/api/auth/register`| Register user   |
| POST   | `/api/auth/login`   | Login user      |

### Buses
| Method | Endpoint                      | Description       |
|--------|------------------------------|-------------------|
| GET    | `/api/buses/search`          | Search buses      |
| GET    | `/api/buses/{id}/seats`      | Seat layout       |
| POST   | `/api/buses/`                | Create bus (admin)|

### Bookings
| Method | Endpoint                        | Description      |
|--------|---------------------------------|------------------|
| POST   | `/api/bookings/lock-seat`       | Lock seat        |
| POST   | `/api/bookings/`                | Create booking   |
| GET    | `/api/bookings/my`              | My bookings      |
| PATCH  | `/api/bookings/{id}/cancel`     | Cancel booking   |

### Payments
| Method | Endpoint          | Description       |
|--------|------------------|-------------------|
| POST   | `/api/payments/` | Process payment   |

---

## 🔧 Environment Variables (backend/.env)

```env
DATABASE_URL=postgresql://routexen_user:routexen_pass@db:5432/routexen_db
REDIS_URL=redis://redis:6379/0
SECRET_KEY=super-secret-jwt-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
ADMIN_EMAIL=admin@routexen.com
```

---

## 📧 View Email Notifications

Email notifications appear in the Celery worker container logs:

```bash
docker-compose logs -f celery_worker
```

---

## 🗄️ Database Migrations

```bash
# Run inside backend container
docker-compose exec backend alembic upgrade head

# Generate new migration after model changes
docker-compose exec backend alembic revision --autogenerate -m "description"
```

---

## 🧪 Testing the Flow

1. Open http://localhost:3000
2. Register or login with demo credentials
3. Search: **Mumbai → Pune** (tomorrow's date)
4. Select a bus → Pick a seat
5. Pay via UPI
6. View confirmation ticket
7. Check Celery logs for email simulation
8. Visit **My Bookings** to see status update

---

## 🏆 Architecture Highlights

- **Stateless JWT auth** — no server-side sessions
- **Redis SET NX EX** — atomic seat locking, auto-expire
- **Celery async** — non-blocking booking confirmation
- **Alembic** — version-controlled schema migrations
- **Docker Compose** — one-command deployment

---

*Built for demonstration and interview evaluation purposes. © 2026 RouteXen*
