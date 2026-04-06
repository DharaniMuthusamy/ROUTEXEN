from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.database import Base


class BookingStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bus_id = Column(Integer, ForeignKey("buses.id"), nullable=False)
    seat_number = Column(Integer, nullable=False)
    total_amount = Column(Float, nullable=False)
    booking_time = Column(DateTime, default=datetime.utcnow)
    booking_status = Column(Enum(BookingStatus), default=BookingStatus.PENDING)

    user = relationship("User", back_populates="bookings")
    bus = relationship("Bus", back_populates="bookings")
    payment = relationship("Payment", back_populates="booking", uselist=False)
