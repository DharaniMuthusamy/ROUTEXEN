from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from db.session import get_db
from routers.flights import router as flights_router
from routers.seats import router as seats_router
from routers.locks import router as locks_router
from routers.airports import router as airports_router
from routers.auth import router as auth_router
from routers.bookings import router as bookings_router


app = FastAPI(title="Flight ticket Booking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(flights_router)
app.include_router(seats_router)
app.include_router(locks_router)
app.include_router(airports_router)
app.include_router(bookings_router)

@app.get("/")
def root():
    return {"message": "Flight Booking API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/health/db")
async def health_db(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("SELECT 1 AS ok"))
    return {"db": result.mappings().first()["ok"]}
