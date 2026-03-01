from app.db.database import SessionLocal
from app.models.user import User
from app.models.bus import Bus
from app.services.email_service import send_booking_confirmation_email, send_admin_notification_email
from app.core.config import settings

if __name__ == '__main__':
    db = SessionLocal()
    user = db.query(User).filter(User.email=='smtp-test@example.com').first()
    bus = db.query(Bus).first()
    booking_id = 9999
    seat_number = 1
    journey_date = str(bus.journey_date) if bus else '2026-03-02'
    amount = 250.0

    print('SMTP_ENABLED:', settings.SMTP_ENABLED)
    send_booking_confirmation_email(user.email if user else 'smtp-test@example.com', user.name if user else 'SMTP Test', booking_id, bus.bus_number if bus else 'RX-000', seat_number, journey_date, amount)
    send_admin_notification_email(settings.ADMIN_EMAIL, booking_id, user.email if user else 'smtp-test@example.com', bus.bus_number if bus else 'RX-000', seat_number, amount)
    print('Done')
