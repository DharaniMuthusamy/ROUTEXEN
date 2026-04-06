"""
Synchronous SQLAlchemy session for Celery workers.
Celery runs synchronous code, so it cannot use the async engine from session.py.
This creates a standard psycopg2-based engine for background tasks.
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

load_dotenv()
if not os.getenv("DATABASE_URL"):
    load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))

# Convert async URL -> sync URL
# e.g. postgresql+asyncpg://... -> postgresql://...
_async_url = os.getenv("DATABASE_URL", "")
SYNC_DATABASE_URL = _async_url.replace("postgresql+asyncpg://", "postgresql://")

sync_engine = create_engine(
    SYNC_DATABASE_URL,
    echo=False,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
)

SyncSessionLocal = sessionmaker(
    bind=sync_engine,
    class_=Session,
    expire_on_commit=False,
)


def get_sync_db():
    """Context-manager style session for Celery tasks."""
    session = SyncSessionLocal()
    try:
        yield session
    finally:
        session.close()
