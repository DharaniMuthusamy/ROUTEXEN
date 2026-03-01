from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.booking import BookingStatus
from app.schemas.bus import BusOut


class BookingCreate(BaseModel):
    bus_id: int
    seat_number: int


class BookingOut(BaseModel):
    id: int
    user_id: int
    bus_id: int
    seat_number: int
    total_amount: float
    booking_time: datetime
    booking_status: BookingStatus
    bus: Optional[BusOut] = None

    class Config:
        from_attributes = True


class SeatLockRequest(BaseModel):
    bus_id: int
    seat_number: int


class SeatLockResponse(BaseModel):
    message: str
    locked: bool
