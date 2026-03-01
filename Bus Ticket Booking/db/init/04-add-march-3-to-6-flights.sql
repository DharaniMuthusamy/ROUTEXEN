-- ============================================
-- Add flights for 2026-03-03 to 2026-03-06
-- Covers ALL 25 existing routes
-- Run AFTER 03-add-airplanes.sql
-- ============================================

-- =============================================
-- MARCH 3, 2026
-- =============================================

-- Chennai → Delhi (1→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2043', 1, 2, '2026-03-03', '06:30', '09:15', 4399, 1),
    (2, 'AI-543',  1, 2, '2026-03-03', '10:00', '12:45', 5999, 1),
    (3, 'UK-821',  1, 2, '2026-03-03', '14:30', '17:15', 6599, 1),
    (4, 'SG-8156', 1, 2, '2026-03-03', '19:00', '21:45', 3999, 1);

-- Delhi → Mumbai (2→3)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-5012', 2, 3, '2026-03-03', '08:00', '10:10', 3899, 2),
    (2, 'AI-680',  2, 3, '2026-03-03', '12:30', '14:40', 5299, 1),
    (3, 'UK-955',  2, 3, '2026-03-03', '17:00', '19:10', 6999, 3);

-- Mumbai → Bangalore (3→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-301',  3, 4, '2026-03-03', '09:00', '10:30', 3399, 1),
    (4, 'SG-201',  3, 4, '2026-03-03', '13:00', '14:30', 2999, 2),
    (2, 'AI-501',  3, 4, '2026-03-03', '18:00', '19:30', 4699, 1);

-- Bangalore → Hyderabad (4→5)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-401',  4, 5, '2026-03-03', '07:30', '08:45', 2599, 2),
    (3, 'UK-701',  4, 5, '2026-03-03', '16:00', '17:15', 4099, 1);

-- Delhi → Kolkata (2→6)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-401',  2, 6, '2026-03-03', '06:00', '08:15', 4999, 5),
    (6, 'G8-301',  2, 6, '2026-03-03', '15:00', '17:15', 3299, 2);

-- Bangalore → Goa (4→7)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-8156', 4, 7, '2026-03-03', '16:30', '17:45', 3099, 2),
    (5, 'I5-901',  4, 7, '2026-03-03', '10:00', '11:15', 2599, 1);

-- Delhi → Chennai (2→1)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2050', 2, 1, '2026-03-03', '07:00', '09:45', 4499, 2),
    (2, 'AI-544',  2, 1, '2026-03-03', '13:30', '16:15', 5899, 1);

-- Mumbai → Delhi (3→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (3, 'UK-956',  3, 2, '2026-03-03', '06:30', '08:40', 6899, 3),
    (1, '6E-5013', 3, 2, '2026-03-03', '14:00', '16:10', 3999, 2);

-- Bangalore → Mumbai (4→3)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-202',  4, 3, '2026-03-03', '08:00', '09:30', 3099, 2),
    (1, '6E-302',  4, 3, '2026-03-03', '17:00', '18:30', 3499, 1);

-- Hyderabad → Bangalore (5→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-502',  5, 4, '2026-03-03', '09:30', '10:45', 2699, 2);

-- Kolkata → Delhi (6→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-402',  6, 2, '2026-03-03', '11:00', '13:15', 5099, 5);

-- Goa → Bangalore (7→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-8157', 7, 4, '2026-03-03', '12:00', '13:15', 3199, 2);

-- Delhi → Bangalore (2→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-803',  2, 4, '2026-03-03', '05:30', '08:15', 5599, 5),
    (3, 'UK-835',  2, 4, '2026-03-03', '16:00', '18:45', 7299, 3);

-- Chennai → Mumbai (1→3)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-6001', 1, 3, '2026-03-03', '08:00', '10:00', 3899, 2),
    (2, 'AI-617',  1, 3, '2026-03-03', '15:30', '17:30', 5499, 5);

-- Delhi → Goa (2→7)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-7210', 2, 7, '2026-03-03', '09:00', '11:30', 5099, 3),
    (5, 'I5-2100', 2, 7, '2026-03-03', '14:30', '17:00', 3899, 2);

-- Chennai → Bangalore (1→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2071', 1, 4, '2026-03-03', '06:30', '07:30', 2299, 4),
    (3, 'UK-845',  1, 4, '2026-03-03', '18:00', '19:00', 3599, 1);

-- Hyderabad → Delhi (5→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (6, 'G8-510',  5, 2, '2026-03-03', '07:00', '09:15', 3999, 2),
    (2, 'AI-652',  5, 2, '2026-03-03', '19:00', '21:15', 5399, 5);

-- Mumbai → Goa (3→7)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-5530', 3, 7, '2026-03-03', '10:00', '11:05', 2499, 4),
    (4, 'SG-9020', 3, 7, '2026-03-03', '16:00', '17:05', 2199, 2);

-- Delhi → Jaipur (2→11)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2301', 2, 11, '2026-03-03', '07:30', '08:20', 2099, 4),
    (6, 'G8-115',  2, 11, '2026-03-03', '17:00', '17:50', 1899, 4);

-- Jaipur → Delhi (11→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2302', 11, 2, '2026-03-03', '09:00', '09:50', 2199, 4);

-- Mumbai → Kochi (3→8)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-680',  3, 8, '2026-03-03', '11:00', '12:45', 4399, 3);

-- Chennai → Kochi (1→8)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-771',  1, 8, '2026-03-03', '06:00', '07:15', 2399, 4);

-- Delhi → Ahmedabad (2→10)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-3030', 2, 10, '2026-03-03', '08:00', '09:30', 2999, 2);

-- Bangalore → Pune (4→9)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-6115', 4, 9, '2026-03-03', '12:00', '13:30', 2699, 4);

-- Kolkata → Guwahati (6→12)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-350',  6, 12, '2026-03-03', '14:00', '15:10', 1999, 4);


-- =============================================
-- MARCH 4, 2026
-- =============================================

-- Chennai → Delhi (1→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2043', 1, 2, '2026-03-04', '06:30', '09:15', 4499, 1),
    (2, 'AI-543',  1, 2, '2026-03-04', '10:00', '12:45', 6099, 1),
    (3, 'UK-821',  1, 2, '2026-03-04', '14:30', '17:15', 6699, 3),
    (4, 'SG-8156', 1, 2, '2026-03-04', '19:00', '21:45', 4099, 1);

-- Delhi → Mumbai (2→3)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-5012', 2, 3, '2026-03-04', '08:00', '10:10', 3999, 2),
    (2, 'AI-680',  2, 3, '2026-03-04', '12:30', '14:40', 5399, 1),
    (3, 'UK-955',  2, 3, '2026-03-04', '17:00', '19:10', 7099, 3);

-- Mumbai → Bangalore (3→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-301',  3, 4, '2026-03-04', '09:00', '10:30', 3499, 1),
    (4, 'SG-201',  3, 4, '2026-03-04', '13:00', '14:30', 3099, 2),
    (2, 'AI-501',  3, 4, '2026-03-04', '18:00', '19:30', 4799, 5);

-- Bangalore → Hyderabad (4→5)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-401',  4, 5, '2026-03-04', '07:30', '08:45', 2699, 2),
    (3, 'UK-701',  4, 5, '2026-03-04', '16:00', '17:15', 4199, 1);

-- Delhi → Kolkata (2→6)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-401',  2, 6, '2026-03-04', '06:00', '08:15', 5099, 5),
    (6, 'G8-301',  2, 6, '2026-03-04', '15:00', '17:15', 3399, 2);

-- Bangalore → Goa (4→7)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-8156', 4, 7, '2026-03-04', '16:30', '17:45', 3199, 2),
    (5, 'I5-901',  4, 7, '2026-03-04', '10:00', '11:15', 2699, 1);

-- Delhi → Chennai (2→1)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2050', 2, 1, '2026-03-04', '07:00', '09:45', 4599, 2),
    (2, 'AI-544',  2, 1, '2026-03-04', '13:30', '16:15', 5999, 1);

-- Mumbai → Delhi (3→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (3, 'UK-956',  3, 2, '2026-03-04', '06:30', '08:40', 6999, 3),
    (1, '6E-5013', 3, 2, '2026-03-04', '14:00', '16:10', 4099, 2);

-- Bangalore → Mumbai (4→3)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-202',  4, 3, '2026-03-04', '08:00', '09:30', 3199, 2),
    (1, '6E-302',  4, 3, '2026-03-04', '17:00', '18:30', 3599, 1);

-- Hyderabad → Bangalore (5→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-502',  5, 4, '2026-03-04', '09:30', '10:45', 2799, 2);

-- Kolkata → Delhi (6→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-402',  6, 2, '2026-03-04', '11:00', '13:15', 5199, 5);

-- Goa → Bangalore (7→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-8157', 7, 4, '2026-03-04', '12:00', '13:15', 3299, 2);

-- Delhi → Bangalore (2→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-803',  2, 4, '2026-03-04', '05:30', '08:15', 5699, 5),
    (3, 'UK-835',  2, 4, '2026-03-04', '16:00', '18:45', 7399, 3);

-- Chennai → Mumbai (1→3)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-6001', 1, 3, '2026-03-04', '08:00', '10:00', 3999, 2),
    (2, 'AI-617',  1, 3, '2026-03-04', '15:30', '17:30', 5599, 5);

-- Delhi → Goa (2→7)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-7210', 2, 7, '2026-03-04', '09:00', '11:30', 5199, 3),
    (5, 'I5-2100', 2, 7, '2026-03-04', '14:30', '17:00', 3999, 2);

-- Chennai → Bangalore (1→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2071', 1, 4, '2026-03-04', '06:30', '07:30', 2399, 4),
    (3, 'UK-845',  1, 4, '2026-03-04', '18:00', '19:00', 3699, 1);

-- Hyderabad → Delhi (5→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (6, 'G8-510',  5, 2, '2026-03-04', '07:00', '09:15', 4099, 2),
    (2, 'AI-652',  5, 2, '2026-03-04', '19:00', '21:15', 5499, 5);

-- Mumbai → Goa (3→7)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-5530', 3, 7, '2026-03-04', '10:00', '11:05', 2599, 4),
    (4, 'SG-9020', 3, 7, '2026-03-04', '16:00', '17:05', 2299, 2);

-- Delhi → Jaipur (2→11)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2301', 2, 11, '2026-03-04', '07:30', '08:20', 2199, 4),
    (6, 'G8-115',  2, 11, '2026-03-04', '17:00', '17:50', 1999, 4);

-- Jaipur → Delhi (11→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2302', 11, 2, '2026-03-04', '09:00', '09:50', 2299, 4);

-- Mumbai → Kochi (3→8)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-680',  3, 8, '2026-03-04', '11:00', '12:45', 4499, 3);

-- Chennai → Kochi (1→8)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-771',  1, 8, '2026-03-04', '06:00', '07:15', 2499, 4);

-- Delhi → Ahmedabad (2→10)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-3030', 2, 10, '2026-03-04', '08:00', '09:30', 3099, 2);

-- Bangalore → Pune (4→9)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-6115', 4, 9, '2026-03-04', '12:00', '13:30', 2799, 4);

-- Kolkata → Guwahati (6→12)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-350',  6, 12, '2026-03-04', '14:00', '15:10', 2099, 4);


-- =============================================
-- MARCH 5, 2026
-- =============================================

-- Chennai → Delhi (1→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2043', 1, 2, '2026-03-05', '06:30', '09:15', 4199, 1),
    (2, 'AI-543',  1, 2, '2026-03-05', '10:00', '12:45', 5799, 1),
    (3, 'UK-821',  1, 2, '2026-03-05', '14:30', '17:15', 6399, 3),
    (4, 'SG-8156', 1, 2, '2026-03-05', '19:00', '21:45', 3799, 1);

-- Delhi → Mumbai (2→3)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-5012', 2, 3, '2026-03-05', '08:00', '10:10', 3699, 2),
    (2, 'AI-680',  2, 3, '2026-03-05', '12:30', '14:40', 5099, 1),
    (3, 'UK-955',  2, 3, '2026-03-05', '17:00', '19:10', 6799, 3);

-- Mumbai → Bangalore (3→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-301',  3, 4, '2026-03-05', '09:00', '10:30', 3199, 1),
    (4, 'SG-201',  3, 4, '2026-03-05', '13:00', '14:30', 2799, 2),
    (2, 'AI-501',  3, 4, '2026-03-05', '18:00', '19:30', 4499, 5);

-- Bangalore → Hyderabad (4→5)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-401',  4, 5, '2026-03-05', '07:30', '08:45', 2399, 2),
    (3, 'UK-701',  4, 5, '2026-03-05', '16:00', '17:15', 3899, 1);

-- Delhi → Kolkata (2→6)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-401',  2, 6, '2026-03-05', '06:00', '08:15', 4799, 5),
    (6, 'G8-301',  2, 6, '2026-03-05', '15:00', '17:15', 3099, 2);

-- Bangalore → Goa (4→7)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-8156', 4, 7, '2026-03-05', '16:30', '17:45', 2899, 2),
    (5, 'I5-901',  4, 7, '2026-03-05', '10:00', '11:15', 2399, 1);

-- Delhi → Chennai (2→1)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2050', 2, 1, '2026-03-05', '07:00', '09:45', 4299, 2),
    (2, 'AI-544',  2, 1, '2026-03-05', '13:30', '16:15', 5699, 1);

-- Mumbai → Delhi (3→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (3, 'UK-956',  3, 2, '2026-03-05', '06:30', '08:40', 6699, 3),
    (1, '6E-5013', 3, 2, '2026-03-05', '14:00', '16:10', 3799, 2);

-- Bangalore → Mumbai (4→3)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-202',  4, 3, '2026-03-05', '08:00', '09:30', 2899, 2),
    (1, '6E-302',  4, 3, '2026-03-05', '17:00', '18:30', 3299, 1);

-- Hyderabad → Bangalore (5→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-502',  5, 4, '2026-03-05', '09:30', '10:45', 2499, 2);

-- Kolkata → Delhi (6→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-402',  6, 2, '2026-03-05', '11:00', '13:15', 4899, 5);

-- Goa → Bangalore (7→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-8157', 7, 4, '2026-03-05', '12:00', '13:15', 3099, 2);

-- Delhi → Bangalore (2→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-803',  2, 4, '2026-03-05', '05:30', '08:15', 5399, 5),
    (3, 'UK-835',  2, 4, '2026-03-05', '16:00', '18:45', 7099, 3);

-- Chennai → Mumbai (1→3)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-6001', 1, 3, '2026-03-05', '08:00', '10:00', 3699, 2),
    (2, 'AI-617',  1, 3, '2026-03-05', '15:30', '17:30', 5299, 5);

-- Delhi → Goa (2→7)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-7210', 2, 7, '2026-03-05', '09:00', '11:30', 4899, 3),
    (5, 'I5-2100', 2, 7, '2026-03-05', '14:30', '17:00', 3699, 2);

-- Chennai → Bangalore (1→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2071', 1, 4, '2026-03-05', '06:30', '07:30', 2099, 4),
    (3, 'UK-845',  1, 4, '2026-03-05', '18:00', '19:00', 3399, 1);

-- Hyderabad → Delhi (5→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (6, 'G8-510',  5, 2, '2026-03-05', '07:00', '09:15', 3799, 2),
    (2, 'AI-652',  5, 2, '2026-03-05', '19:00', '21:15', 5199, 5);

-- Mumbai → Goa (3→7)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-5530', 3, 7, '2026-03-05', '10:00', '11:05', 2299, 4),
    (4, 'SG-9020', 3, 7, '2026-03-05', '16:00', '17:05', 1999, 2);

-- Delhi → Jaipur (2→11)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2301', 2, 11, '2026-03-05', '07:30', '08:20', 1899, 4),
    (6, 'G8-115',  2, 11, '2026-03-05', '17:00', '17:50', 1699, 4);

-- Jaipur → Delhi (11→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2302', 11, 2, '2026-03-05', '09:00', '09:50', 1999, 4);

-- Mumbai → Kochi (3→8)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-680',  3, 8, '2026-03-05', '11:00', '12:45', 4199, 3);

-- Chennai → Kochi (1→8)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-771',  1, 8, '2026-03-05', '06:00', '07:15', 2199, 4);

-- Delhi → Ahmedabad (2→10)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-3030', 2, 10, '2026-03-05', '08:00', '09:30', 2799, 2);

-- Bangalore → Pune (4→9)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-6115', 4, 9, '2026-03-05', '12:00', '13:30', 2499, 4);

-- Kolkata → Guwahati (6→12)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-350',  6, 12, '2026-03-05', '14:00', '15:10', 1799, 4);


-- =============================================
-- MARCH 6, 2026
-- =============================================

-- Chennai → Delhi (1→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2043', 1, 2, '2026-03-06', '06:30', '09:15', 4599, 1),
    (2, 'AI-543',  1, 2, '2026-03-06', '10:00', '12:45', 6199, 1),
    (3, 'UK-821',  1, 2, '2026-03-06', '14:30', '17:15', 6799, 3),
    (4, 'SG-8156', 1, 2, '2026-03-06', '19:00', '21:45', 4199, 1);

-- Delhi → Mumbai (2→3)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-5012', 2, 3, '2026-03-06', '08:00', '10:10', 4099, 2),
    (2, 'AI-680',  2, 3, '2026-03-06', '12:30', '14:40', 5499, 1),
    (3, 'UK-955',  2, 3, '2026-03-06', '17:00', '19:10', 7199, 3);

-- Mumbai → Bangalore (3→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-301',  3, 4, '2026-03-06', '09:00', '10:30', 3599, 1),
    (4, 'SG-201',  3, 4, '2026-03-06', '13:00', '14:30', 3199, 2),
    (2, 'AI-501',  3, 4, '2026-03-06', '18:00', '19:30', 4899, 5);

-- Bangalore → Hyderabad (4→5)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-401',  4, 5, '2026-03-06', '07:30', '08:45', 2799, 2),
    (3, 'UK-701',  4, 5, '2026-03-06', '16:00', '17:15', 4299, 1);

-- Delhi → Kolkata (2→6)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-401',  2, 6, '2026-03-06', '06:00', '08:15', 5199, 5),
    (6, 'G8-301',  2, 6, '2026-03-06', '15:00', '17:15', 3499, 2);

-- Bangalore → Goa (4→7)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-8156', 4, 7, '2026-03-06', '16:30', '17:45', 3299, 2),
    (5, 'I5-901',  4, 7, '2026-03-06', '10:00', '11:15', 2799, 1);

-- Delhi → Chennai (2→1)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2050', 2, 1, '2026-03-06', '07:00', '09:45', 4699, 2),
    (2, 'AI-544',  2, 1, '2026-03-06', '13:30', '16:15', 6099, 1);

-- Mumbai → Delhi (3→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (3, 'UK-956',  3, 2, '2026-03-06', '06:30', '08:40', 7099, 3),
    (1, '6E-5013', 3, 2, '2026-03-06', '14:00', '16:10', 4199, 2);

-- Bangalore → Mumbai (4→3)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-202',  4, 3, '2026-03-06', '08:00', '09:30', 3299, 2),
    (1, '6E-302',  4, 3, '2026-03-06', '17:00', '18:30', 3699, 1);

-- Hyderabad → Bangalore (5→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-502',  5, 4, '2026-03-06', '09:30', '10:45', 2899, 2);

-- Kolkata → Delhi (6→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-402',  6, 2, '2026-03-06', '11:00', '13:15', 5299, 5);

-- Goa → Bangalore (7→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-8157', 7, 4, '2026-03-06', '12:00', '13:15', 3399, 2);

-- Delhi → Bangalore (2→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-803',  2, 4, '2026-03-06', '05:30', '08:15', 5799, 5),
    (3, 'UK-835',  2, 4, '2026-03-06', '16:00', '18:45', 7499, 3);

-- Chennai → Mumbai (1→3)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-6001', 1, 3, '2026-03-06', '08:00', '10:00', 4099, 2),
    (2, 'AI-617',  1, 3, '2026-03-06', '15:30', '17:30', 5699, 5);

-- Delhi → Goa (2→7)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-7210', 2, 7, '2026-03-06', '09:00', '11:30', 5299, 3),
    (5, 'I5-2100', 2, 7, '2026-03-06', '14:30', '17:00', 4099, 2);

-- Chennai → Bangalore (1→4)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2071', 1, 4, '2026-03-06', '06:30', '07:30', 2499, 4),
    (3, 'UK-845',  1, 4, '2026-03-06', '18:00', '19:00', 3799, 1);

-- Hyderabad → Delhi (5→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (6, 'G8-510',  5, 2, '2026-03-06', '07:00', '09:15', 4199, 2),
    (2, 'AI-652',  5, 2, '2026-03-06', '19:00', '21:15', 5599, 5);

-- Mumbai → Goa (3→7)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-5530', 3, 7, '2026-03-06', '10:00', '11:05', 2699, 4),
    (4, 'SG-9020', 3, 7, '2026-03-06', '16:00', '17:05', 2399, 2);

-- Delhi → Jaipur (2→11)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2301', 2, 11, '2026-03-06', '07:30', '08:20', 2299, 4),
    (6, 'G8-115',  2, 11, '2026-03-06', '17:00', '17:50', 2099, 4);

-- Jaipur → Delhi (11→2)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-2302', 11, 2, '2026-03-06', '09:00', '09:50', 2399, 4);

-- Mumbai → Kochi (3→8)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (2, 'AI-680',  3, 8, '2026-03-06', '11:00', '12:45', 4599, 3);

-- Chennai → Kochi (1→8)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-771',  1, 8, '2026-03-06', '06:00', '07:15', 2599, 4);

-- Delhi → Ahmedabad (2→10)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (4, 'SG-3030', 2, 10, '2026-03-06', '08:00', '09:30', 3199, 2);

-- Bangalore → Pune (4→9)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (1, '6E-6115', 4, 9, '2026-03-06', '12:00', '13:30', 2899, 4);

-- Kolkata → Guwahati (6→12)
INSERT INTO flight_instances (airline_id, flight_number, from_airport_id, to_airport_id, travel_date, departure_time, arrival_time, base_price, seat_map_id) VALUES
    (5, 'I5-350',  6, 12, '2026-03-06', '14:00', '15:10', 2199, 4);
