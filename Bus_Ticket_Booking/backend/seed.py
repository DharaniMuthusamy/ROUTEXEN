#!/usr/bin/env python3
"""
Seed script to populate the database with sample data.
Run inside the backend container: python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import date, timedelta
from app.db.database import SessionLocal, engine, Base
from app.core.config import settings
from app.models import User, Bus, Booking, Payment, Notification
from app.core.security import hash_password

# If using local sqlite dev DB, remove it so schema changes (new columns) are applied cleanly during development
if settings.DATABASE_URL.startswith("sqlite"):
    db_path = settings.DATABASE_URL.split("sqlite:///")[-1]
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
            print(f"Removed existing sqlite db: {db_path}")
        except Exception as e:
            print(f"Warning: could not remove {db_path}: {e}")

Base.metadata.create_all(bind=engine)

# Ensure 'rating' column exists (add it for SQLite if DB already existed)
from sqlalchemy import text
conn = engine.connect()
try:
    res = conn.execute(text("PRAGMA table_info(buses);"))
    cols = [r[1] for r in res.fetchall()]
    if 'rating' not in cols:
        try:
            conn.execute(text("ALTER TABLE buses ADD COLUMN rating FLOAT DEFAULT 4.5;"))
            print('Added rating column to buses table')
        except Exception as e:
            print('Could not add rating column:', e)
finally:
    conn.close()

db = SessionLocal()

try:
    # Create admin user
    admin = db.query(User).filter(User.email == "admin@routexen.com").first()
    if not admin:
        admin = User(
            name="RouteXen Admin",
            email="admin@routexen.com",
            phone_number="9000000000",
            hashed_password=hash_password("admin123"),
            is_admin=True,
        )
        db.add(admin)
        db.flush()
        print("✅ Admin user created: admin@routexen.com / admin123")

    # Create regular users
    users_data = [
        {"name": "Arjun Sharma", "email": "arjun@example.com", "phone_number": "9876543210"},
        {"name": "Priya Nair",   "email": "priya@example.com", "phone_number": "9812345678"},
        {"name": "Ravi Kumar",   "email": "ravi@example.com",  "phone_number": "9765432109"},
    ]
    created_users = []
    for ud in users_data:
        u = db.query(User).filter(User.email == ud["email"]).first()
        if not u:
            u = User(**ud, hashed_password=hash_password("pass1234"))
            db.add(u)
            db.flush()
            print(f"✅ User created: {ud['email']} / pass1234")
        created_users.append(u)

    # Create buses
    today = date.today()
    buses_data = [
        {
            "bus_number": "RX-001",
            "operator_name": "ExpressBus India",
            "source_city": "Mumbai",
            "destination_city": "Pune",
            "journey_date": today + timedelta(days=1),
            "departure_time": "06:00",
            "arrival_time": "09:30",
            "total_seats": 40,
            "price_per_seat": 350.0,
            "bus_type": "AC_SEATER",
        },
        {
            "bus_number": "RX-002",
            "operator_name": "VRL Travels",
            "source_city": "Mumbai",
            "destination_city": "Pune",
            "journey_date": today + timedelta(days=1),
            "departure_time": "10:00",
            "arrival_time": "13:30",
            "total_seats": 36,
            "price_per_seat": 299.0,
            "bus_type": "SEATER",
        },
        {
            "bus_number": "RX-003",
            "operator_name": "Orange Travels",
            "source_city": "Bangalore",
            "destination_city": "Chennai",
            "journey_date": today + timedelta(days=2),
            "departure_time": "21:00",
            "arrival_time": "05:00",
            "total_seats": 40,
            "price_per_seat": 599.0,
            "bus_type": "AC_SLEEPER",
        },
        {
            "bus_number": "RX-004",
            "operator_name": "SRS Travels",
            "source_city": "Hyderabad",
            "destination_city": "Bangalore",
            "journey_date": today + timedelta(days=1),
            "departure_time": "22:00",
            "arrival_time": "07:00",
            "total_seats": 36,
            "price_per_seat": 799.0,
            "bus_type": "SLEEPER",
        },
        {
            "bus_number": "RX-005",
            "operator_name": "RedBus Express",
            "source_city": "Delhi",
            "destination_city": "Jaipur",
            "journey_date": today + timedelta(days=3),
            "departure_time": "07:00",
            "arrival_time": "12:00",
            "total_seats": 45,
            "price_per_seat": 450.0,
            "bus_type": "SEATER",
        },
        {
            "bus_number": "RX-006",
            "operator_name": "Patel Tours",
            "source_city": "Ahmedabad",
            "destination_city": "Mumbai",
            "journey_date": today + timedelta(days=2),
            "departure_time": "08:00",
            "arrival_time": "16:00",
            "total_seats": 36,
            "price_per_seat": 650.0,
            "bus_type": "AC_SEATER",
        },
        {
            "bus_number": "RX-007",
            "operator_name": "KPN Travels",
            "source_city": "Chennai",
            "destination_city": "Bangalore",
            "journey_date": today + timedelta(days=1),
            "departure_time": "23:00",
            "arrival_time": "06:00",
            "total_seats": 40,
            "price_per_seat": 550.0,
            "bus_type": "AC_SLEEPER",
        },
        {
            "bus_number": "RX-008",
            "operator_name": "Hans Travels",
            "source_city": "Jaipur",
            "destination_city": "Delhi",
            "journey_date": today + timedelta(days=2),
            "departure_time": "05:00",
            "arrival_time": "10:30",
            "total_seats": 40,
            "price_per_seat": 400.0,
            "bus_type": "SEATER",
        },
    ]


    created_buses = []
    for bd in buses_data:
        b = db.query(Bus).filter(Bus.bus_number == bd["bus_number"]).first()
        if not b:
            b = Bus(**bd)
            db.add(b)
            db.flush()
            print(f"✅ Bus created: {bd['bus_number']} ({bd['source_city']} → {bd['destination_city']})")
        created_buses.append(b)

    # Generate buses for the 100 specified Tamil Nadu + Bangalore routes
    operators = [
        "ExpressBus India", "VRL Travels", "Orange Travels", "SRS Travels",
        "RedBus Express", "Patel Tours", "KPN Travels", "Hans Travels",
        "Sharma Coaches", "MegaLines"
    ]

    import itertools
    import random

    base_cities = [
        "Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tirunelveli", 
        "Vellore", "Thanjavur", "Kanyakumari", "Puducherry", "Erode", "Tiruppur", 
        "Ooty", "Palakkad", "Dindigul", "Rameswaram", "Thoothukudi", "Sivakasi", 
        "Virudhunagar", "Karur", "Namakkal", "Pudukkottai", "Cuddalore", "Villupuram", 
        "Dharmapuri", "Krishnagiri", "Bangalore", "Kanchipuram", "Mumbai", "Pune", 
        "Hyderabad", "Delhi", "Jaipur", "Ahmedabad"
    ]

    # Dynamically generate ALL possible routes (every city to every other city)
    routes = list(itertools.permutations(base_cities, 2))

    random.seed(42)

    gen_count = 0
    # collect unique place names to populate places table
    place_names = set()
    for (a, b) in routes:
        place_names.add(a)
        place_names.add(b)
    # also include any cities used in the initial buses_data
    for bd in buses_data:
        place_names.add(bd["source_city"])
        place_names.add(bd["destination_city"])

    # insert places
    from app.models.place import Place
    for pname in sorted(place_names):
        existing_place = db.query(Place).filter(Place.name == pname).first()
        if not existing_place:
            db.add(Place(name=pname))
    db.flush()

    # For each route create a total of 10-15 buses (spread across today and tomorrow)
    buses_to_insert = []
    for (src, dst) in routes:
        for days_ahead in [0, 1]:  # Generate for today and tomorrow
            total_for_route_per_day = random.randint(10, 15)
            # Ensure there's a mix of AC/Non-AC Sleeper/Seater
            for idx in range(total_for_route_per_day):
                jd = today + timedelta(days=days_ahead)
                bus_no = f"RX-{src[:3].upper()}{dst[:3].upper()}-{days_ahead:02d}-{gen_count:06d}"
                
                op = operators[(gen_count + idx) % len(operators)]
                dep_hour = 5 + (idx * 2) % 20 + (gen_count % 4)
                arr_hour = (dep_hour + random.randint(3, 8)) % 24
                total_seats = 36 if (gen_count % 3 == 0) else 40
                price = 200.0 + (abs(hash(src + dst)) % 400) + (days_ahead * 10) + (idx * 5)
                bus_type = random.choice(["AC_SEATER", "SEATER", "AC_SLEEPER", "SLEEPER"])
                rating_val = round(3.5 + (abs(hash(bus_no)) % 150) / 100.0, 1)  # 3.5 - 5.0 range roughly
                
                b = Bus(
                    bus_number=bus_no,
                    operator_name=op,
                    source_city=src,
                    destination_city=dst,
                    journey_date=jd,
                    departure_time=f"{dep_hour:02d}:00",
                    arrival_time=f"{arr_hour:02d}:30",
                    total_seats=total_seats,
                    price_per_seat=float(price),
                    bus_type=bus_type,
                    rating=float(rating_val),
                )
                db.add(b)
                gen_count += 1

    db.commit()
    print("\n🎉 Seed data loaded successfully!")
    print("   Admin: admin@routexen.com / admin123")
    print("   User:  arjun@example.com / pass1234")

finally:
    db.close()
