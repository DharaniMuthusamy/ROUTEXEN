from pydantic import BaseModel
from datetime import datetime
from app.models.payment import PaymentStatus


class PaymentCreate(BaseModel):
    booking_id: int
    payment_method: str
    passenger_email: str | None = None
    passenger_name: str | None = None


class PaymentOut(BaseModel):
    id: int
    booking_id: int
    payment_method: str
    payment_status: PaymentStatus
    transaction_time: datetime

    class Config:
        from_attributes = True
