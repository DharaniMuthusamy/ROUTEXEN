"""
Redis client with graceful fallback.
If Redis is not available, all operations become no-ops so the app
still runs for local development without Redis installed.
"""
import redis
from app.core.config import settings

try:
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True, socket_connect_timeout=2)
    redis_client.ping()          # test connection immediately
    REDIS_AVAILABLE = True
except Exception:
    redis_client = None
    REDIS_AVAILABLE = False
    print("⚠️  Redis not available — seat locking disabled (demo mode)")
