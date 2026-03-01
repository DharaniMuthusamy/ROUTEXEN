from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.bus import Bus
from app.models.payment import Payment
from app.core.dependencies import get_admin_user
from app.models.user import User

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("/summary")
def booking_summary(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    total = db.query(Booking).count()
    confirmed = db.query(Booking).filter(Booking.booking_status == BookingStatus.CONFIRMED).count()
    pending = db.query(Booking).filter(Booking.booking_status == BookingStatus.PENDING).count()
    cancelled = db.query(Booking).filter(Booking.booking_status == BookingStatus.CANCELLED).count()

    revenue = (
        db.query(func.sum(Booking.total_amount))
        .filter(Booking.booking_status == BookingStatus.CONFIRMED)
        .scalar()
        or 0.0
    )

    return {
        "total_bookings": total,
        "confirmed": confirmed,
        "pending": pending,
        "cancelled": cancelled,
        "total_revenue": round(float(revenue), 2),
    }


@router.get("/bus-wise")
def bus_wise_summary(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    results = (
        db.query(Bus.id, Bus.bus_number, Bus.source_city, Bus.destination_city,
                 func.count(Booking.id).label("total_bookings"),
                 func.sum(Booking.total_amount).label("revenue"))
        .outerjoin(Booking, Bus.id == Booking.bus_id)
        .filter(Booking.booking_status != BookingStatus.CANCELLED if True else True)
        .group_by(Bus.id, Bus.bus_number, Bus.source_city, Bus.destination_city)
        .all()
    )

    return [
        {
            "bus_id": r.id,
            "bus_number": r.bus_number,
            "route": f"{r.source_city} → {r.destination_city}",
            "total_bookings": r.total_bookings or 0,
            "revenue": round(float(r.revenue or 0), 2),
        }
        for r in results
    ]


@router.get("/user-history/{user_id}")
def user_booking_history(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    bookings = (
        db.query(Booking)
        .filter(Booking.user_id == user_id)
        .order_by(Booking.booking_time.desc())
        .all()
    )
    return [
        {
            "booking_id": b.id,
            "bus_id": b.bus_id,
            "seat_number": b.seat_number,
            "amount": b.total_amount,
            "status": b.booking_status,
            "time": b.booking_time.isoformat(),
        }
        for b in bookings
    ]
