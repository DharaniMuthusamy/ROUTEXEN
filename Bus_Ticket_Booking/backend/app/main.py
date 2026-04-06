from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine, Base

# Import all models so SQLAlchemy creates the tables
from app.models import User, Bus, Booking, Payment, Notification  # noqa: F401

from app.routes import auth, buses, bookings, payments, notifications, reports, places

# Create tables (used with alembic in prod, direct for dev convenience)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create tables on startup: {e}")
    print("Tables should be created via Alembic migrations")

app = FastAPI(
    title="RouteXen API",
    description="Smart Bus Ticket Booking System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(buses.router)
app.include_router(bookings.router)
app.include_router(payments.router)
app.include_router(notifications.router)
app.include_router(reports.router)
app.include_router(places.router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "RouteXen API", "version": "1.0.0"}
