from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.database import Base


class PaymentStatus(str, enum.Enum):
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    payment_method = Column(String(50), nullable=False)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.SUCCESS)
    transaction_time = Column(DateTime, default=datetime.utcnow)

    booking = relationship("Booking", back_populates="payment")
