import enum
from sqlalchemy import Column, Integer, String, Date, Float, Enum
from sqlalchemy.orm import relationship
from app.db.database import Base


class BusType(str, enum.Enum):
    SEATER = "SEATER"
    SLEEPER = "SLEEPER"
    AC_SEATER = "AC_SEATER"
    AC_SLEEPER = "AC_SLEEPER"


class Bus(Base):
    __tablename__ = "buses"

    id = Column(Integer, primary_key=True, index=True)
    bus_number = Column(String(20), unique=True, nullable=False)
    operator_name = Column(String(100), nullable=False)
    source_city = Column(String(100), nullable=False)
    destination_city = Column(String(100), nullable=False)
    journey_date = Column(Date, nullable=False)
    departure_time = Column(String(10), nullable=False)
    arrival_time = Column(String(10), nullable=False)
    total_seats = Column(Integer, nullable=False, default=40)
    price_per_seat = Column(Float, nullable=False)
    bus_type = Column(Enum(BusType), default=BusType.SEATER, nullable=False)
    rating = Column(Float, nullable=False, default=4.5)

    bookings = relationship("Booking", back_populates="bus")
