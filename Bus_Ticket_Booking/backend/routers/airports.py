from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from db.session import get_db

router = APIRouter(prefix="/airports", tags=["Airports"])

@router.get("")
async def list_airports(db: AsyncSession = Depends(get_db)):
    sql = text("""
        SELECT id, code, name, city
        FROM airports
        ORDER BY city ASC;
    """)
    result = await db.execute(sql)
    rows = result.mappings().all()
    return [dict(row) for row in rows]
