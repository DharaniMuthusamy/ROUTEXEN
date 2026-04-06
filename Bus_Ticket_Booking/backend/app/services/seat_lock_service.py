from app.db.redis_client import redis_client, REDIS_AVAILABLE

LOCK_EXPIRE_SECONDS = 120  # 2 minutes


def lock_seat(bus_id: int, seat_number: int, user_id: int) -> bool:
    """
    Attempt to lock a seat using Redis SET NX EX.
    Returns True always when Redis is unavailable (graceful degradation).
    """
    if not REDIS_AVAILABLE or redis_client is None:
        return True   # no Redis — allow booking without locking
    key = f"lock:bus:{bus_id}:seat:{seat_number}"
    result = redis_client.set(key, str(user_id), ex=LOCK_EXPIRE_SECONDS, nx=True)
    return result is not None


def unlock_seat(bus_id: int, seat_number: int) -> None:
    """Remove the Redis lock for a seat after booking completion."""
    if not REDIS_AVAILABLE or redis_client is None:
        return
    key = f"lock:bus:{bus_id}:seat:{seat_number}"
    redis_client.delete(key)


def get_seat_lock_owner(bus_id: int, seat_number: int) -> str | None:
    """Return the user_id who holds the lock, or None."""
    if not REDIS_AVAILABLE or redis_client is None:
        return None
    key = f"lock:bus:{bus_id}:seat:{seat_number}"
    return redis_client.get(key)


def get_locked_seats(bus_id: int) -> list[int]:
    """Return a list of all locked seat numbers for a bus."""
    if not REDIS_AVAILABLE or redis_client is None:
        return []
    pattern = f"lock:bus:{bus_id}:seat:*"
    keys = redis_client.keys(pattern)
    locked = []
    for key in keys:
        parts = key.split(":")
        if len(parts) == 5:
            try:
                locked.append(int(parts[4]))
            except ValueError:
                pass
    return locked
