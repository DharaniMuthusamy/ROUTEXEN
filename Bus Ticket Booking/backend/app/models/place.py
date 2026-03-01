from sqlalchemy import Column, Integer, String
from app.db.database import Base


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)

    def __repr__(self):
        return f"<Place id={self.id} name={self.name}>"
