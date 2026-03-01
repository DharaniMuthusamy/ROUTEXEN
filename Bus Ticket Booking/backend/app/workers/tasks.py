import time
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "routexen",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
)


@celery_app.task(name="workers.tasks.confirm_booking")
def confirm_booking(booking_id: int, user_email: str, user_name: str,
                    bus_number: str, seat_number: int,
                    journey_date: str, total_amount: float,
                    admin_email: str) -> dict:
    """
    Background task:
    1. Simulate processing delay (3-5 seconds)
    2. Update booking status to CONFIRMED in DB
    3. Send emails
    4. Create notification record
    """
    from app.db.database import SessionLocal
    from app.models.booking import Booking, BookingStatus
    from app.models.notification import Notification
    from app.services.email_service import (send_booking_confirmation_email,
                                             send_admin_notification_email)

    # Simulate processing delay
    time.sleep(4)

    db = SessionLocal()
    try:
        # Update booking status
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if booking:
            booking.booking_status = BookingStatus.CONFIRMED

            # Create notification
            notification = Notification(
                user_id=booking.user_id,
                message=(
                    f"Booking #{booking_id} confirmed! "
                    f"Bus {bus_number}, Seat {seat_number} on {journey_date}. "
                    f"Amount paid: ₹{total_amount:.2f}"
                ),
            )
            db.add(notification)
            db.commit()

        # Send console emails
        send_booking_confirmation_email(
            user_email=user_email,
            user_name=user_name,
            booking_id=booking_id,
            bus_number=bus_number,
            seat_number=seat_number,
            journey_date=journey_date,
            total_amount=total_amount,
        )
        send_admin_notification_email(
            admin_email=admin_email,
            booking_id=booking_id,
            user_email=user_email,
            bus_number=bus_number,
            seat_number=seat_number,
            total_amount=total_amount,
        )

        return {"status": "success", "booking_id": booking_id}
    finally:
        db.close()
