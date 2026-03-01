from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.models.bus import BusType


class BusCreate(BaseModel):
    bus_number: str
    operator_name: str
    source_city: str
    destination_city: str
    journey_date: date
    departure_time: str
    arrival_time: str
    total_seats: int = 40
    price_per_seat: float
    bus_type: BusType = BusType.SEATER


class BusOut(BaseModel):
    id: int
    bus_number: str
    operator_name: str
    source_city: str
    destination_city: str
    journey_date: date
    departure_time: str
    arrival_time: str
    total_seats: int
    price_per_seat: float
    bus_type: BusType
    rating: float
    available_seats: Optional[int] = None

    class Config:
        from_attributes = True


class BusSearchParams(BaseModel):
    source_city: str
    destination_city: str
    journey_date: date
