"""
Celery background tasks for the Flight Booking application.

Tasks:
  1. expire_seat_holds   — runs every 60s via Celery Beat
  2. send_ticket_confirmation_email — triggered on booking creation
"""
import redis
import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from sqlalchemy import text
from celery_app import celery_app
from db.sync_session import SyncSessionLocal
from email_service import send_booking_email

load_dotenv()
if not os.getenv("REDIS_HOST"):
    load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))

_redis = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Task 1: Periodic seat-hold cleanup
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@celery_app.task(name="tasks.expire_seat_holds", bind=True, max_retries=3)
def expire_seat_holds(self):
    """
    Finds seat_holds whose expires_at < NOW() and removes them.
    Also clears the corresponding Redis keys.
    Runs every 60 seconds via Celery Beat.
    """
    try:
        session = SyncSessionLocal()
        now = datetime.now(timezone.utc)

        # 1. Find all expired holds
        result = session.execute(
            text("""
                SELECT id, flight_instance_id, seat_no
                FROM seat_holds
                WHERE expires_at < :now
            """),
            {"now": now},
        )
        expired_holds = result.mappings().all()

        if not expired_holds:
            return {"expired_count": 0, "message": "No expired holds found"}

        expired_count = 0
        for hold in expired_holds:
            fid = hold["flight_instance_id"]
            seat = hold["seat_no"]

            # 2. Delete the expired hold from DB
            session.execute(
                text("DELETE FROM seat_holds WHERE id = :hid"),
                {"hid": hold["id"]},
            )

            # 3. Clear the Redis key
            redis_key = f"hold:{fid}:{seat}"
            _redis.delete(redis_key)

            expired_count += 1

        session.commit()
        session.close()

        print(f"[CELERY] ✅ Expired {expired_count} seat hold(s)")
        return {"expired_count": expired_count, "message": f"Released {expired_count} expired holds"}

    except Exception as exc:
        print(f"[CELERY] ❌ expire_seat_holds failed: {exc}")
        if 'session' in locals():
            session.rollback()
            session.close()
        raise self.retry(exc=exc, countdown=10)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Task 2: Send booking confirmation email
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@celery_app.task(name="tasks.send_ticket_confirmation_email", bind=True, max_retries=3)
def send_ticket_confirmation_email(self, booking_id: int):
    """
    Fetches booking details from DB and sends a confirmation email
    to the passenger. Called via .delay(booking_id) after booking creation.
    """
    try:
        session = SyncSessionLocal()

        # 1. Fetch booking + flight + airline + airports
        result = session.execute(
            text("""
                SELECT
                    b.id, b.pnr, b.total_amount, b.status,
                    b.passenger_name, b.passenger_email,
                    fi.flight_number, fi.travel_date,
                    fi.departure_time, fi.arrival_time,
                    al.name AS airline,
                    ap_from.city AS from_city, ap_from.code AS from_code,
                    ap_to.city AS to_city, ap_to.code AS to_code
                FROM bookings b
                JOIN flight_instances fi ON b.flight_instance_id = fi.id
                JOIN airlines al ON fi.airline_id = al.id
                JOIN airports ap_from ON fi.from_airport_id = ap_from.id
                JOIN airports ap_to ON fi.to_airport_id = ap_to.id
                WHERE b.id = :bid
            """),
            {"bid": booking_id},
        )
        booking = result.mappings().first()

        if not booking:
            print(f"[CELERY] ⚠️ Booking {booking_id} not found — skipping email")
            session.close()
            return {"status": "skipped", "reason": "booking not found"}

        # 2. Fetch seats for this booking
        seats_result = session.execute(
            text("SELECT seat_no FROM booking_seats WHERE booking_id = :bid"),
            {"bid": booking_id},
        )
        seats = [row["seat_no"] for row in seats_result.mappings().all()]

        session.close()

        # 3. Build data dict and send email
        to_email = booking["passenger_email"]
        booking_data = {
            "pnr": booking["pnr"],
            "passenger_name": booking["passenger_name"] or "Traveller",
            "flight_number": booking["flight_number"],
            "airline": booking["airline"],
            "from_city": booking["from_city"],
            "from_code": booking["from_code"],
            "to_city": booking["to_city"],
            "to_code": booking["to_code"],
            "travel_date": str(booking["travel_date"]),
            "departure_time": str(booking["departure_time"])[:5],
            "arrival_time": str(booking["arrival_time"])[:5],
            "seats": seats if seats else ["Seat Not Selected / Assigned at Check-in"],
            "total_amount": float(booking["total_amount"]),
            "status": booking["status"],
        }

        success = send_booking_email(to_email, booking_data)

        return {
            "status": "sent" if success else "failed",
            "booking_id": booking_id,
            "to": to_email,
        }

    except Exception as exc:
        print(f"[CELERY] ❌ send_ticket_confirmation_email failed for booking {booking_id}: {exc}")
        if 'session' in locals():
            session.close()
        raise self.retry(exc=exc, countdown=30)
