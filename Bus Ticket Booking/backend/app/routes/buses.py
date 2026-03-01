from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional

from app.db.database import get_db
from app.models.bus import Bus, BusType
from app.models.booking import Booking, BookingStatus
from app.schemas.bus import BusCreate, BusOut
from app.core.dependencies import get_current_user, get_admin_user
from app.models.user import User
from app.services.seat_lock_service import get_locked_seats

router = APIRouter(prefix="/api/buses", tags=["Buses"])


@router.post("/", response_model=BusOut, status_code=201)
def create_bus(
    payload: BusCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    existing = db.query(Bus).filter(Bus.bus_number == payload.bus_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bus number already exists")

    bus = Bus(**payload.model_dump())
    db.add(bus)
    db.commit()
    db.refresh(bus)
    return _bus_with_available_seats(bus, db)


@router.get("/search", response_model=List[BusOut])
def search_buses(
    source_city: str = Query(...),
    destination_city: str = Query(...),
    journey_date: date = Query(...),
    bus_type: Optional[BusType] = Query(None),
    operator_name: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Bus).filter(
        Bus.source_city.ilike(f"%{source_city}%"),
        Bus.destination_city.ilike(f"%{destination_city}%"),
        Bus.journey_date == journey_date,
    )

    if bus_type:
        query = query.filter(Bus.bus_type == bus_type)

    if operator_name:
        query = query.filter(Bus.operator_name.ilike(f"%{operator_name}%"))

    if min_price is not None:
        query = query.filter(Bus.price_per_seat >= min_price)

    if max_price is not None:
        query = query.filter(Bus.price_per_seat <= max_price)

    buses = query.all()
    return [_bus_with_available_seats(b, db) for b in buses]


@router.get("/{bus_id}", response_model=BusOut)
def get_bus(bus_id: int, db: Session = Depends(get_db)):
    bus = db.query(Bus).filter(Bus.id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")
    return _bus_with_available_seats(bus, db)


@router.get("/{bus_id}/seats")
def get_seat_layout(bus_id: int, db: Session = Depends(get_db)):
    bus = db.query(Bus).filter(Bus.id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")

    # Booked seats from DB
    booked_seats = {
        b.seat_number
        for b in db.query(Booking)
        .filter(
            Booking.bus_id == bus_id,
            Booking.booking_status != BookingStatus.CANCELLED,
        )
        .all()
    }

    # Locked seats from Redis
    locked_seats = set(get_locked_seats(bus_id))

    seats = []
    for seat_num in range(1, bus.total_seats + 1):
        if seat_num in booked_seats:
            status = "BOOKED"
        elif seat_num in locked_seats:
            status = "LOCKED"
        else:
            status = "AVAILABLE"
        seats.append({"seat_number": seat_num, "status": status})

    return {"bus_id": bus_id, "total_seats": bus.total_seats, "seats": seats}


@router.get("/", response_model=List[BusOut])
def list_all_buses(db: Session = Depends(get_db)):
    buses = db.query(Bus).all()
    return [_bus_with_available_seats(b, db) for b in buses]


def _bus_with_available_seats(bus: Bus, db: Session) -> dict:
    booked_count = (
        db.query(Booking)
        .filter(
            Booking.bus_id == bus.id,
            Booking.booking_status != BookingStatus.CANCELLED,
        )
        .count()
    )
    result = BusOut.model_validate(bus)
    result.available_seats = bus.total_seats - booked_count
    return result
