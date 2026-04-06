-- ============================================
-- Bookings Table (tracks user bookings)
-- ============================================

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    flight_instance_id INTEGER NOT NULL REFERENCES flight_instances(id),
    pnr VARCHAR(20) NOT NULL UNIQUE,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    passenger_name VARCHAR(200),
    passenger_email VARCHAR(255),
    passenger_phone VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add user_id and booking_id to booking_seats
ALTER TABLE booking_seats ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
ALTER TABLE booking_seats ADD COLUMN IF NOT EXISTS booking_id INTEGER REFERENCES bookings(id);
