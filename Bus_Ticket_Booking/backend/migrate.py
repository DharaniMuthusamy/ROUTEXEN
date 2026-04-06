import asyncio
from sqlalchemy import text
from db.session import engine

async def run():
    # Check existing tables
    async with engine.begin() as conn:
        r = await conn.execute(text(
            "SELECT table_name FROM information_schema.tables "
            "WHERE table_schema='public' ORDER BY table_name"
        ))
        tables = [row[0] for row in r.fetchall()]
        print("Existing tables:", tables)

    # Enable pgcrypto extension
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS pgcrypto"))
        print("pgcrypto extension enabled")

    # Create users table if not exists
    if 'users' not in tables:
        async with engine.begin() as conn:
            await conn.execute(text(
                "CREATE TABLE users ("
                "id UUID PRIMARY KEY DEFAULT gen_random_uuid(), "
                "name VARCHAR(100) NOT NULL, "
                "email VARCHAR(255) NOT NULL UNIQUE, "
                "password_hash TEXT NOT NULL, "
                "created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), "
                "updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()"
                ")"
            ))
            print("Created users table")
    else:
        print("users table already exists")

    # Create seat_holds table if not exists
    if 'seat_holds' not in tables:
        async with engine.begin() as conn:
            await conn.execute(text(
                "CREATE TABLE seat_holds ("
                "id SERIAL PRIMARY KEY, "
                "flight_instance_id INTEGER REFERENCES flight_instances(id), "
                "seat_no VARCHAR(10) NOT NULL, "
                "user_id UUID REFERENCES users(id), "
                "held_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), "
                "expires_at TIMESTAMPTZ NOT NULL, "
                "UNIQUE (flight_instance_id, seat_no)"
                ")"
            ))
            print("Created seat_holds table")

        async with engine.begin() as conn:
            await conn.execute(text(
                "CREATE INDEX idx_seat_holds_expires ON seat_holds (expires_at)"
            ))
            print("Created index on seat_holds.expires_at")
    else:
        print("seat_holds table already exists")

    # Verify
    async with engine.begin() as conn:
        r = await conn.execute(text(
            "SELECT table_name FROM information_schema.tables "
            "WHERE table_schema='public' ORDER BY table_name"
        ))
        print("Final tables:", [row[0] for row in r.fetchall()])

    print("Migration complete!")

asyncio.run(run())
