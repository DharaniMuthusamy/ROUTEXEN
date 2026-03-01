-- ============================================
-- Flight Booking DB - Schema & Seed Data
-- ============================================

-- Airlines
CREATE TABLE IF NOT EXISTS airlines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL
);

-- Airports
CREATE TABLE IF NOT EXISTS airports (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL
);

-- Seat Maps (aircraft layouts)
CREATE TABLE IF NOT EXISTS seat_maps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Seat Map Seats
CREATE TABLE IF NOT EXISTS seat_map_seats (
    id SERIAL PRIMARY KEY,
    seat_map_id INTEGER REFERENCES seat_maps(id),
    seat_no VARCHAR(10) NOT NULL
);

-- Flight Instances
CREATE TABLE IF NOT EXISTS flight_instances (
    id SERIAL PRIMARY KEY,
    airline_id INTEGER REFERENCES airlines(id),
    flight_number VARCHAR(20) NOT NULL,
    from_airport_id INTEGER REFERENCES airports(id),
    to_airport_id INTEGER REFERENCES airports(id),
    travel_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'INR',
    seat_map_id INTEGER REFERENCES seat_maps(id)
);

-- Booking Seats (tracks booked seats per flight)
CREATE TABLE IF NOT EXISTS booking_seats (
    id SERIAL PRIMARY KEY,
    flight_instance_id INTEGER REFERENCES flight_instances(id),
    seat_no VARCHAR(10) NOT NULL,
    booked_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (flight_instance_id, seat_no)
);

-- ============================================
-- Users & Authentication
-- ============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Seat Holds (temporary locks before payment)
-- ============================================

CREATE TABLE IF NOT EXISTS seat_holds (
    id SERIAL PRIMARY KEY,
    flight_instance_id INTEGER REFERENCES flight_instances(id),
    seat_no VARCHAR(10) NOT NULL,
    user_id UUID REFERENCES users(id),
    held_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    UNIQUE (flight_instance_id, seat_no)
);

-- Index for fast expiration cleanup
CREATE INDEX IF NOT EXISTS idx_seat_holds_expires ON seat_holds (expires_at);

-- ============================================
-- Seed Data
-- ============================================

-- Airlines
INSERT INTO airlines (name, code) VALUES
    ('IndiGo', '6E'),
    ('Air India', 'AI'),
    ('Vistara', 'UK'),
    ('SpiceJet', 'SG'),
    ('AirAsia India', 'I5'),
    ('Go First', 'G8')
ON CONFLICT (code) DO NOTHING;

-- Airports
INSERT INTO airports (code, name, city) VALUES
    ('MAA', 'Chennai International Airport', 'Chennai'),
    ('DEL', 'Indira Gandhi International Airport', 'Delhi'),
    ('BOM', 'Chhatrapati Shivaji International Airport', 'Mumbai'),
    ('BLR', 'Kempegowda International Airport', 'Bangalore'),
    ('HYD', 'Rajiv Gandhi International Airport', 'Hyderabad'),
    ('CCU', 'Netaji Subhas Chandra Bose Airport', 'Kolkata'),
    ('GOI', 'Goa International Airport', 'Goa'),
    ('COK', 'Cochin International Airport', 'Kochi'),
    ('PNQ', 'Pune Airport', 'Pune'),
    ('AMD', 'Sardar Vallabhbhai Patel Airport', 'Ahmedabad'),
    ('JAI', 'Jaipur International Airport', 'Jaipur'),
    ('GAU', 'Lokpriya Gopinath Bordoloi Airport', 'Guwahati')
ON CONFLICT (code) DO NOTHING;

-- Seat Map (A320 layout: 30 rows x 6 seats)
INSERT INTO seat_maps (id, name) VALUES (1, 'Airbus A320 Standard') ON CONFLICT DO NOTHING;

-- Generate seats 1A-30F for seat_map_id=1
DO $$
BEGIN
    FOR r IN 1..30 LOOP
        INSERT INTO seat_map_seats (seat_map_id, seat_no) VALUES
            (1, r || 'A'), (1, r || 'B'), (1, r || 'C'),
            (1, r || 'D'), (1, r || 'E'), (1, r || 'F');
    END LOOP;
END $$;

-- Flight Instances (various routes, multiple dates)
-- Chennai → Delhi
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2043', 1, 2, '2026-03-01', '06:30', '09:15', 4299, 1),
    (2, 'AI-543',  1, 2, '2026-03-01', '10:00', '12:45', 5899, 1),
    (3, 'UK-821',  1, 2, '2026-03-01', '14:30', '17:15', 6499, 1),
    (4, 'SG-8156', 1, 2, '2026-03-01', '19:00', '21:45', 3899, 1),
    (1, '6E-2044', 1, 2, '2026-03-02', '07:00', '09:45', 4599, 1),
    (5, 'I5-1723', 1, 2, '2026-03-02', '11:30', '14:15', 3599, 1);

-- Delhi → Mumbai
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-5012', 2, 3, '2026-03-01', '08:00', '10:10', 3799, 1),
    (2, 'AI-680',  2, 3, '2026-03-01', '12:30', '14:40', 5199, 1),
    (3, 'UK-955',  2, 3, '2026-03-01', '17:00', '19:10', 6899, 1);

-- Mumbai → Bangalore
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-301',  3, 4, '2026-03-01', '09:00', '10:30', 3299, 1),
    (4, 'SG-201',  3, 4, '2026-03-01', '13:00', '14:30', 2899, 1),
    (2, 'AI-501',  3, 4, '2026-03-01', '18:00', '19:30', 4599, 1);

-- Bangalore → Hyderabad
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-401',  4, 5, '2026-03-01', '07:30', '08:45', 2499, 1),
    (3, 'UK-701',  4, 5, '2026-03-01', '16:00', '17:15', 3999, 1);

-- Delhi → Kolkata
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-401',  2, 6, '2026-03-01', '06:00', '08:15', 4899, 1),
    (6, 'G8-301',  2, 6, '2026-03-01', '15:00', '17:15', 3199, 1);

-- Bangalore → Goa
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-8156', 4, 7, '2026-03-01', '16:30', '17:45', 2999, 1),
    (5, 'I5-901',  4, 7, '2026-03-01', '10:00', '11:15', 2499, 1);