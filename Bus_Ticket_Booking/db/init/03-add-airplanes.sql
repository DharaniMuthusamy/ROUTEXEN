-- ============================================
-- Add More Aircraft Types & Flights
-- Run AFTER init.sql has been applied
-- ============================================

-- =====================
-- New Seat Maps (Aircraft Types)
-- =====================
INSERT INTO seat_maps (id, name) VALUES
    (2, 'Boeing 737-800'),
    (3, 'Airbus A321neo'),
    (4, 'ATR 72-600'),
    (5, 'Boeing 777-300ER')
ON CONFLICT DO NOTHING;

-- Boeing 737-800: 30 rows × 6 seats (A-F) = 180 seats
DO $$
BEGIN
    FOR r IN 1..30 LOOP
        INSERT INTO seat_map_seats (seat_map_id, seat_no) VALUES
            (2, r || 'A'), (2, r || 'B'), (2, r || 'C'),
            (2, r || 'D'), (2, r || 'E'), (2, r || 'F');
    END LOOP;
END $$;

-- Airbus A321neo: 36 rows × 6 seats (A-F) = 216 seats
DO $$
BEGIN
    FOR r IN 1..36 LOOP
        INSERT INTO seat_map_seats (seat_map_id, seat_no) VALUES
            (3, r || 'A'), (3, r || 'B'), (3, r || 'C'),
            (3, r || 'D'), (3, r || 'E'), (3, r || 'F');
    END LOOP;
END $$;

-- ATR 72-600: 18 rows × 4 seats (A-D) = 72 seats (regional turboprop)
DO $$
BEGIN
    FOR r IN 1..18 LOOP
        INSERT INTO seat_map_seats (seat_map_id, seat_no) VALUES
            (4, r || 'A'), (4, r || 'B'),
            (4, r || 'C'), (4, r || 'D');
    END LOOP;
END $$;

-- Boeing 777-300ER: 40 rows × 9 seats (A-J, skip I) = 360 seats (wide-body)
DO $$
BEGIN
    FOR r IN 1..40 LOOP
        INSERT INTO seat_map_seats (seat_map_id, seat_no) VALUES
            (5, r || 'A'), (5, r || 'B'), (5, r || 'C'),
            (5, r || 'D'), (5, r || 'E'), (5, r || 'F'),
            (5, r || 'G'), (5, r || 'H'), (5, r || 'J');
    END LOOP;
END $$;

-- =====================
-- New Flight Instances (32 new → total ~50)
-- Covers return routes + new city pairs
-- Uses all 12 airports & 5 aircraft types
-- =====================

-- ---- RETURN ROUTES ----

-- Delhi → Chennai (return of MAA→DEL)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2050', 2, 1, '2026-03-01', '07:00', '09:45', 4399, 2),
    (2, 'AI-544',  2, 1, '2026-03-01', '13:30', '16:15', 5799, 1);

-- Mumbai → Delhi (return of DEL→BOM)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (3, 'UK-956',  3, 2, '2026-03-01', '06:30', '08:40', 6799, 3),
    (1, '6E-5013', 3, 2, '2026-03-01', '14:00', '16:10', 3899, 2);

-- Bangalore → Mumbai (return of BOM→BLR)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-202',  4, 3, '2026-03-01', '08:00', '09:30', 2999, 2),
    (1, '6E-302',  4, 3, '2026-03-01', '17:00', '18:30', 3399, 1);

-- Hyderabad → Bangalore (return of BLR→HYD)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-502',  5, 4, '2026-03-01', '09:30', '10:45', 2599, 2);

-- Kolkata → Delhi (return of DEL→CCU)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-402',  6, 2, '2026-03-01', '11:00', '13:15', 4999, 5);

-- Goa → Bangalore (return of BLR→GOI)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-8157', 7, 4, '2026-03-01', '12:00', '13:15', 3099, 2);

-- ---- NEW ROUTES: connecting unused airports ----

-- Delhi → Bangalore
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-803',  2, 4, '2026-03-01', '05:30', '08:15', 5499, 5),
    (3, 'UK-835',  2, 4, '2026-03-01', '16:00', '18:45', 7199, 3);

-- Chennai → Mumbai
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-6001', 1, 3, '2026-03-01', '08:00', '10:00', 3799, 2),
    (2, 'AI-617',  1, 3, '2026-03-01', '15:30', '17:30', 5399, 5);

-- Delhi → Goa
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-7210', 2, 7, '2026-03-01', '09:00', '11:30', 4999, 3),
    (5, 'I5-2100', 2, 7, '2026-03-01', '14:30', '17:00', 3799, 2);

-- Chennai → Bangalore
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2071', 1, 4, '2026-03-01', '06:30', '07:30', 2199, 4),
    (3, 'UK-845',  1, 4, '2026-03-01', '18:00', '19:00', 3499, 1);

-- Hyderabad → Delhi
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (6, 'G8-510',  5, 2, '2026-03-01', '07:00', '09:15', 3899, 2),
    (2, 'AI-652',  5, 2, '2026-03-01', '19:00', '21:15', 5299, 5);

-- Mumbai → Goa
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-5530', 3, 7, '2026-03-01', '10:00', '11:05', 2399, 4),
    (4, 'SG-9020', 3, 7, '2026-03-01', '16:00', '17:05', 2099, 2);

-- Delhi → Jaipur (uses JAI)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2301', 2, 11, '2026-03-01', '07:30', '08:20', 1999, 4),
    (6, 'G8-115',  2, 11, '2026-03-01', '17:00', '17:50', 1799, 4);

-- Jaipur → Delhi (return, uses JAI)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2302', 11, 2, '2026-03-01', '09:00', '09:50', 2099, 4);

-- Mumbai → Kochi (uses COK)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-680',  3, 8, '2026-03-01', '11:00', '12:45', 4299, 3);

-- Chennai → Kochi (uses COK)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-771',  1, 8, '2026-03-01', '06:00', '07:15', 2299, 4);

-- Delhi → Ahmedabad (uses AMD)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-3030', 2, 10, '2026-03-01', '08:00', '09:30', 2899, 2);

-- Bangalore → Pune (uses PNQ)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-6115', 4, 9, '2026-03-01', '12:00', '13:30', 2599, 4);

-- Kolkata → Guwahati (uses GAU)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-350',  6, 12, '2026-03-01', '14:00', '15:10', 1899, 4);
