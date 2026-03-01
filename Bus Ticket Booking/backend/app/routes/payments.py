from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.bus import Bus
from app.models.notification import Notification
from app.models.payment import Payment, PaymentStatus
from app.models.user import User
from app.schemas.payment import PaymentCreate, PaymentOut
from app.core.dependencies import get_current_user
from app.services.seat_lock_service import unlock_seat
from app.db.redis_client import REDIS_AVAILABLE
from app.core.config import settings
from app.services.email_service import (
    send_booking_confirmation_email,
    send_admin_notification_email,
)

router = APIRouter(prefix="/api/payments", tags=["Payments"])


@router.post("/", response_model=PaymentOut, status_code=201)
def process_payment(
    payload: PaymentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Simulate payment processing and confirm booking directly."""
    booking = db.query(Booking).filter(Booking.id == payload.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    if booking.booking_status == BookingStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Booking is cancelled")
    if booking.payment:
        raise HTTPException(status_code=400, detail="Payment already processed")

    # Simulate payment success
    payment = Payment(
        booking_id=booking.id,
        payment_method=payload.payment_method,
        payment_status=PaymentStatus.SUCCESS,
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    # Release seat lock — now officially booked
    unlock_seat(booking.bus_id, booking.seat_number)

    # Fetch bus info for notification
    bus = db.query(Bus).filter(Bus.id == booking.bus_id).first()

    # Confirm booking directly (sync) — no Celery needed for local dev
    booking.booking_status = BookingStatus.CONFIRMED
    notification = Notification(
        user_id=booking.user_id,
        message=(
            f"Booking #{booking.id} confirmed! "
            f"Bus {bus.bus_number if bus else 'N/A'}, "
            f"Seat {booking.seat_number} on "
            f"{str(bus.journey_date) if bus else 'N/A'}. "
            f"Amount paid: \u20b9{booking.total_amount:.2f}"
        ),
    )
    db.add(notification)
    db.commit()
    db.refresh(payment)

    # Send simulated emails to user and admin in the background
    target_email = payload.passenger_email if payload.passenger_email else current_user.email
    background_tasks.add_task(
        send_booking_confirmation_email,
        user_email=target_email,
        user_name=payload.passenger_name if hasattr(payload, 'passenger_name') and payload.passenger_name else current_user.name,
        booking_id=booking.id,
        bus_number=bus.bus_number if bus else "N/A",
        seat_number=booking.seat_number,
        journey_date=str(bus.journey_date) if bus else "N/A",
        total_amount=booking.total_amount,
    )
    background_tasks.add_task(
        send_admin_notification_email,
        admin_email=settings.ADMIN_EMAIL,
        booking_id=booking.id,
        user_email=target_email,
        bus_number=bus.bus_number if bus else "N/A",
        seat_number=booking.seat_number,
        total_amount=booking.total_amount,
    )

    return payment
