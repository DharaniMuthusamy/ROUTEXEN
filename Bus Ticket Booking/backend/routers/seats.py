from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from db.session import get_db
from core.redis_client import redis_client

router = APIRouter(prefix="/flights", tags=["Seats"])


@router.get("/{flight_id}/seats")
async def get_seats(flight_id: int, db: AsyncSession = Depends(get_db)):

    # 1. Get seat map id for this flight
    seat_map_query = text("""
        SELECT seat_map_id
        FROM flight_instances
        WHERE id = :flight_id
    """)
    result = await db.execute(seat_map_query, {"flight_id": flight_id})
    seat_map_row = result.mappings().first()

    if not seat_map_row:
        return {"error": "Flight not found"}

    seat_map_id = seat_map_row["seat_map_id"]

    # 2. Get all seats from seat_map
    seats_query = text("""
        SELECT seat_no
        FROM seat_map_seats
        WHERE seat_map_id = :seat_map_id
        ORDER BY seat_no
    """)
    seats_result = await db.execute(seats_query, {"seat_map_id": seat_map_id})
    all_seats = [row["seat_no"] for row in seats_result.mappings().all()]

    # 3. Get booked seats
    booked_query = text("""
        SELECT seat_no
        FROM booking_seats
        WHERE flight_instance_id = :flight_id
    """)
    booked_result = await db.execute(booked_query, {"flight_id": flight_id})
    booked_seats = {row["seat_no"] for row in booked_result.mappings().all()}

    # 4. Get active holds from DB (not expired)
    holds_query = text("""
        SELECT seat_no
        FROM seat_holds
        WHERE flight_instance_id = :flight_id
          AND expires_at > NOW()
    """)
    holds_result = await db.execute(holds_query, {"flight_id": flight_id})
    held_seats_db = {row["seat_no"] for row in holds_result.mappings().all()}

    # 5. Also check Redis for held seats (belt + suspenders)
    held_seats_redis = set()
    for seat in all_seats:
        key = f"hold:{flight_id}:{seat}"
        if redis_client.exists(key):
            held_seats_redis.add(seat)

    locked_seats = held_seats_db | held_seats_redis

    # 6. Clean up expired holds from DB
    await db.execute(
        text("DELETE FROM seat_holds WHERE expires_at <= NOW()")
    )
    await db.commit()

    # 7. Build response
    seat_list = []
    for seat in all_seats:
        if seat in booked_seats:
            status = "BOOKED"
        elif seat in locked_seats:
            status = "LOCKED"
        else:
            status = "AVAILABLE"
        seat_list.append({"seat_no": seat, "status": status})

    return {
        "flight_id": flight_id,
        "total_seats": len(all_seats),
        "seats": seat_list,
    }