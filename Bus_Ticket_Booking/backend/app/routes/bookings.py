from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.bus import Bus
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingOut, SeatLockRequest, SeatLockResponse
from app.core.dependencies import get_current_user
from app.services.seat_lock_service import lock_seat, unlock_seat, get_seat_lock_owner

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])


@router.post("/lock-seat", response_model=SeatLockResponse)
def lock_seat_endpoint(
    payload: SeatLockRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lock a seat in Redis for 2 minutes to prevent double booking."""
    bus = db.query(Bus).filter(Bus.id == payload.bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")

    # Check if already booked in DB
    existing = (
        db.query(Booking)
        .filter(
            Booking.bus_id == payload.bus_id,
            Booking.seat_number == payload.seat_number,
            Booking.booking_status != BookingStatus.CANCELLED,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Seat already booked")

    acquired = lock_seat(payload.bus_id, payload.seat_number, current_user.id)
    if not acquired:
        owner = get_seat_lock_owner(payload.bus_id, payload.seat_number)
        if owner and owner != str(current_user.id):
            raise HTTPException(status_code=409, detail="Seat is temporarily locked by another user")

    return SeatLockResponse(message="Seat locked successfully for 2 minutes", locked=True)


@router.post("/", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a PENDING booking after seat lock is confirmed."""
    bus = db.query(Bus).filter(Bus.id == payload.bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")

    if payload.seat_number < 1 or payload.seat_number > bus.total_seats:
        raise HTTPException(status_code=400, detail="Invalid seat number")

    # Check lock ownership
    owner = get_seat_lock_owner(payload.bus_id, payload.seat_number)
    if owner and owner != str(current_user.id):
        raise HTTPException(status_code=409, detail="Seat is locked by another user")

    # Check if already booked
    existing = (
        db.query(Booking)
        .filter(
            Booking.bus_id == payload.bus_id,
            Booking.seat_number == payload.seat_number,
            Booking.booking_status != BookingStatus.CANCELLED,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Seat already booked")

    booking = Booking(
        user_id=current_user.id,
        bus_id=payload.bus_id,
        seat_number=payload.seat_number,
        total_amount=bus.price_per_seat,
        booking_status=BookingStatus.PENDING,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/my", response_model=List[BookingOut])
def my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.booking_time.desc())
        .all()
    )


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return booking


@router.patch("/{booking_id}/cancel", response_model=BookingOut)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    if booking.booking_status == BookingStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Already cancelled")

    booking.booking_status = BookingStatus.CANCELLED
    # Release seat lock if any
    unlock_seat(booking.bus_id, booking.seat_number)
    db.commit()
    db.refresh(booking)
    return booking
