from fastapi import APIRouter, Depends
from typing import List

from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.place import Place

router = APIRouter(prefix="/api/places", tags=["Places"])


@router.get("/", response_model=List[str])
def list_places(db: Session = Depends(get_db)):
    places = db.query(Place).order_by(Place.name).all()
    return [p.name for p in places]
