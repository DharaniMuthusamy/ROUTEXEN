from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional

from core.redis_client import redis_client
from core.config import SEAT_HOLD_SECONDS
from core.security import get_current_user
from db.session import get_db

router = APIRouter(prefix="/flights", tags=["Seat Holds"])


class HoldRequest(BaseModel):
    seat_no: str


class ReleaseRequest(BaseModel):
    seat_no: str


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 1. Hold a seat (with passenger-count validation)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.post("/{flight_id}/hold-seat")
async def hold_seat(
    flight_id: int,
    data: HoldRequest,
    passenger_count: Optional[int] = Query(None, description="Max seats allowed"),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user_id = str(current_user["id"])
    seat_no = data.seat_no

    # ── Passenger count validation ──
    if passenger_count is not None and passenger_count > 0:
        held_result = await db.execute(
            text("""
                SELECT COUNT(*) AS cnt FROM seat_holds
                WHERE flight_instance_id = :fid
                  AND user_id = :uid
                  AND expires_at > NOW()
            """),
            {"fid": flight_id, "uid": user_id},
        )
        held_count = held_result.mappings().first()["cnt"]
        if held_count >= passenger_count:
            raise HTTPException(
                status_code=400,
                detail=f"You can select only {passenger_count} seats.",
            )

    # 1. Check if seat is already booked
    booked = await db.execute(
        text("""
            SELECT id FROM booking_seats
            WHERE flight_instance_id = :fid AND seat_no = :seat
        """),
        {"fid": flight_id, "seat": seat_no},
    )
    if booked.mappings().first():
        raise HTTPException(status_code=400, detail="Seat is already booked")

    # 2. Check if seat is already held in Redis
    redis_key = f"hold:{flight_id}:{seat_no}"
    existing_holder = redis_client.get(redis_key)
    if existing_holder and existing_holder != user_id:
        raise HTTPException(status_code=400, detail="Seat is already held by another user")

    # 3. If user already holds this seat, return success
    if existing_holder == user_id:
        ttl = redis_client.ttl(redis_key)
        return {
            "message": "Seat already held by you",
            "seat_no": seat_no,
            "expires_in_seconds": max(ttl, 0),
        }

    # 4. Set Redis lock with TTL
    redis_client.set(redis_key, user_id, ex=SEAT_HOLD_SECONDS)

    # 5. Upsert into seat_holds table
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=SEAT_HOLD_SECONDS)
    await db.execute(
        text("""
            INSERT INTO seat_holds (flight_instance_id, seat_no, user_id, held_at, expires_at)
            VALUES (:fid, :seat, :uid, NOW(), :expires)
            ON CONFLICT (flight_instance_id, seat_no)
            DO UPDATE SET user_id = :uid, held_at = NOW(), expires_at = :expires
        """),
        {"fid": flight_id, "seat": seat_no, "uid": user_id, "expires": expires_at},
    )
    await db.commit()

    return {
        "message": "Seat held successfully",
        "seat_no": seat_no,
        "expires_in_seconds": SEAT_HOLD_SECONDS,
    }


# Keep the old endpoint path working as an alias
@router.post("/{flight_id}/hold")
async def hold_seat_legacy(
    flight_id: int,
    data: HoldRequest,
    passenger_count: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Legacy endpoint — redirects to hold-seat."""
    return await hold_seat(flight_id, data, passenger_count, db, current_user)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 2. Release a single seat hold
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.post("/{flight_id}/release-seat")
async def release_seat(
    flight_id: int,
    data: ReleaseRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user_id = str(current_user["id"])
    seat_no = data.seat_no

    # 1. Delete from DB (only if held by this user)
    result = await db.execute(
        text("""
            DELETE FROM seat_holds
            WHERE flight_instance_id = :fid
              AND seat_no = :seat
              AND user_id = :uid
            RETURNING id
        """),
        {"fid": flight_id, "seat": seat_no, "uid": user_id},
    )
    deleted = result.mappings().first()

    # 2. Delete Redis key
    redis_key = f"hold:{flight_id}:{seat_no}"
    holder = redis_client.get(redis_key)
    if holder == user_id:
        redis_client.delete(redis_key)

    await db.commit()

    if not deleted:
        raise HTTPException(status_code=404, detail="Seat hold not found or not yours")

    return {
        "message": "Seat released successfully",
        "seat_no": seat_no,
        "status": "AVAILABLE",
    }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 3. Get hold status for current user on a flight
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/{flight_id}/hold-status")
async def get_hold_status(
    flight_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user_id = str(current_user["id"])

    result = await db.execute(
        text("""
            SELECT seat_no, expires_at
            FROM seat_holds
            WHERE flight_instance_id = :fid
              AND user_id = :uid
              AND expires_at > NOW()
            ORDER BY seat_no
        """),
        {"fid": flight_id, "uid": user_id},
    )
    holds = result.mappings().all()

    if not holds:
        return {
            "held_seats": [],
            "expires_at": None,
            "remaining_seconds": 0,
        }

    held_seats = [h["seat_no"] for h in holds]
    # Use the earliest expiry so the timer reflects the soonest-expiring hold
    earliest_expiry = min(h["expires_at"] for h in holds)
    now = datetime.now(timezone.utc)
    remaining = max(0, int((earliest_expiry - now).total_seconds()))

    return {
        "held_seats": held_seats,
        "expires_at": earliest_expiry.isoformat(),
        "remaining_seconds": remaining,
    }