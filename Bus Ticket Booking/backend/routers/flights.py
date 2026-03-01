from datetime import date as dt_date
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from db.session import get_db

router = APIRouter(prefix="/flights", tags=["Flights"])


def serialize_flight(row):
    """Convert a flight row to a JSON-serializable dict."""
    d = dict(row)
    # Convert date/time objects to strings
    if d.get("travel_date"):
        d["travel_date"] = str(d["travel_date"])
    if d.get("departure_time"):
        d["departure_time"] = str(d["departure_time"])[:5]  # HH:MM
    if d.get("arrival_time"):
        d["arrival_time"] = str(d["arrival_time"])[:5]  # HH:MM
    if d.get("base_price"):
        d["base_price"] = float(d["base_price"])
    return d


@router.get("")
async def search_flights(
    from_code: str = Query(..., alias="from", min_length=3, max_length=10),
    to_code: str = Query(..., alias="to", min_length=3, max_length=10),
    date: str = Query(..., min_length=10, max_length=10), 
    db: AsyncSession = Depends(get_db),
):
    sql = text("""
        SELECT
            f.id,
            a.name AS airline,
            f.flight_number,
            ap_from.code AS from_airport,
            ap_to.code AS to_airport,
            f.travel_date,
            f.departure_time,
            f.arrival_time,
            f.base_price,
            f.currency
        FROM flight_instances f
        JOIN airlines a ON f.airline_id = a.id
        JOIN airports ap_from ON f.from_airport_id = ap_from.id
        JOIN airports ap_to ON f.to_airport_id = ap_to.id
        WHERE ap_from.code = :from_code
          AND ap_to.code = :to_code
          AND f.travel_date = :travel_date
        ORDER BY f.departure_time ASC;
    """)

    travel_date = dt_date.fromisoformat(date)
    result = await db.execute(sql, {"from_code": from_code, "to_code": to_code, "travel_date": travel_date})
    rows = result.mappings().all()
    flights = [serialize_flight(row) for row in rows]
    return {"count": len(flights), "flights": flights}

@router.get("/{flight_id}")
async def get_flight(flight_id: int, db: AsyncSession = Depends(get_db)):
    sql = text("""
        SELECT
            f.id,
            a.name AS airline,
            f.flight_number,
            ap_from.code AS from_airport,
            ap_to.code AS to_airport,
            f.travel_date,
            f.departure_time,
            f.arrival_time,
            f.base_price,
            f.currency
        FROM flight_instances f
        JOIN airlines a ON f.airline_id = a.id
        JOIN airports ap_from ON f.from_airport_id = ap_from.id
        JOIN airports ap_to ON f.to_airport_id = ap_to.id
        WHERE f.id = :flight_id;
    """)
    
    result = await db.execute(sql, {"flight_id": flight_id})
    row = result.mappings().first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Flight not found")
        
    return serialize_flight(row)