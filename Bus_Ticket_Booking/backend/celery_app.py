"""
Celery application configuration.

Run commands:
  Worker:  celery -A celery_app worker --loglevel=info --pool=solo
  Beat:    celery -A celery_app beat --loglevel=info
"""
import os
from celery import Celery
from celery.schedules import crontab
from dotenv import load_dotenv

load_dotenv()
if not os.getenv("REDIS_HOST"):
    load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = os.getenv("REDIS_PORT", "6379")
BROKER_URL = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"
RESULT_BACKEND = f"redis://{REDIS_HOST}:{REDIS_PORT}/1"

celery_app = Celery(
    "flight_booking",
    broker=BROKER_URL,
    backend=RESULT_BACKEND,
    include=["tasks"],  # auto-discover tasks.py
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    # Retry broker connection on startup
    broker_connection_retry_on_startup=True,
)

# ── Celery Beat Schedule ──
celery_app.conf.beat_schedule = {
    "expire-seat-holds-every-60s": {
        "task": "tasks.expire_seat_holds",
        "schedule": 60.0,  # every 60 seconds
    },
}
