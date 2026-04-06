/* ─────────────────────────────────────────────────────────
   Mock Data Service  — used when backend API is not running
   Covers all major Indian city pairs so demo always works
   ───────────────────────────────────────────────────────── */

const CITIES = [
    'Ahmedabad', 'Bangalore', 'Bhopal', 'Bhubaneswar', 'Chennai',
    'Coimbatore', 'Delhi', 'Goa', 'Hyderabad', 'Indore',
    'Jaipur', 'Kolkata', 'Lucknow', 'Mumbai', 'Nagpur',
    'Patna', 'Pune', 'Surat', 'Visakhapatnam', 'Vadodara',
];

const OPERATORS = [
    'VRL Travels', 'Orange Travels', 'ExpressBus India', 'SRS Travels',
    'KPN Travels', 'Patel Tours', 'Hans Travels', 'Paulo Travels',
    'RedBus Express', 'Raj National', 'IntrCity Smart Bus', 'Neeta Tours',
    'National Travels', 'Sugama Tourist', 'KSRTC Premium',
];

const BUS_TYPES = ['SEATER', 'AC_SEATER', 'SLEEPER', 'AC_SLEEPER'];

const TIMES = [
    { dep: '06:00', arr: '10:30' }, { dep: '07:30', arr: '12:00' },
    { dep: '09:00', arr: '15:00' }, { dep: '10:30', arr: '17:00' },
    { dep: '14:00', arr: '20:00' }, { dep: '17:00', arr: '23:00' },
    { dep: '20:00', arr: '04:00' }, { dep: '21:00', arr: '06:00' },
    { dep: '22:00', arr: '07:00' }, { dep: '23:00', arr: '08:00' },
];

const today = new Date();
const fmtDate = (d) => d.toISOString().split('T')[0];
const nextDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return fmtDate(d);
});

/* ── Build a comprehensive route list ── */
const ROUTE_PAIRS = [
    // South India
    ['Bangalore', 'Chennai'], ['Chennai', 'Bangalore'],
    ['Bangalore', 'Hyderabad'], ['Hyderabad', 'Bangalore'],
    ['Chennai', 'Hyderabad'], ['Hyderabad', 'Chennai'],
    ['Bangalore', 'Coimbatore'], ['Coimbatore', 'Bangalore'],
    ['Chennai', 'Coimbatore'], ['Coimbatore', 'Chennai'],
    ['Hyderabad', 'Visakhapatnam'], ['Visakhapatnam', 'Hyderabad'],
    ['Bangalore', 'Goa'], ['Goa', 'Bangalore'],
    ['Chennai', 'Goa'], ['Goa', 'Chennai'],
    // West India
    ['Mumbai', 'Pune'], ['Pune', 'Mumbai'],
    ['Mumbai', 'Goa'], ['Goa', 'Mumbai'],
    ['Mumbai', 'Ahmedabad'], ['Ahmedabad', 'Mumbai'],
    ['Mumbai', 'Surat'], ['Surat', 'Mumbai'],
    ['Ahmedabad', 'Surat'], ['Surat', 'Ahmedabad'],
    ['Mumbai', 'Nagpur'], ['Nagpur', 'Mumbai'],
    ['Pune', 'Goa'], ['Goa', 'Pune'],
    ['Ahmedabad', 'Vadodara'], ['Vadodara', 'Ahmedabad'],
    // North India
    ['Delhi', 'Jaipur'], ['Jaipur', 'Delhi'],
    ['Delhi', 'Lucknow'], ['Lucknow', 'Delhi'],
    ['Delhi', 'Agra'], ['Agra', 'Delhi'],
    ['Jaipur', 'Lucknow'], ['Lucknow', 'Jaipur'],
    // Central India
    ['Mumbai', 'Indore'], ['Indore', 'Mumbai'],
    ['Delhi', 'Bhopal'], ['Bhopal', 'Delhi'],
    ['Pune', 'Nagpur'], ['Nagpur', 'Pune'],
    ['Indore', 'Bhopal'], ['Bhopal', 'Indore'],
    ['Hyderabad', 'Nagpur'], ['Nagpur', 'Hyderabad'],
    // East India
    ['Kolkata', 'Bhubaneswar'], ['Bhubaneswar', 'Kolkata'],
    ['Kolkata', 'Patna'], ['Patna', 'Kolkata'],
    ['Hyderabad', 'Bhubaneswar'], ['Bhubaneswar', 'Hyderabad'],
    // Long-distance cross-country
    ['Delhi', 'Mumbai'], ['Mumbai', 'Delhi'],
    ['Delhi', 'Bangalore'], ['Bangalore', 'Delhi'],
    ['Delhi', 'Hyderabad'], ['Hyderabad', 'Delhi'],
    ['Delhi', 'Kolkata'], ['Kolkata', 'Delhi'],
    ['Mumbai', 'Bangalore'], ['Bangalore', 'Mumbai'],
    ['Mumbai', 'Hyderabad'], ['Hyderabad', 'Mumbai'],
    ['Mumbai', 'Kolkata'], ['Kolkata', 'Mumbai'],
    ['Bangalore', 'Kolkata'], ['Kolkata', 'Bangalore'],
    ['Chennai', 'Kolkata'], ['Kolkata', 'Chennai'],
    // Bhopal routes (to fix the Bangalore→Bhopal case)
    ['Bangalore', 'Bhopal'], ['Bhopal', 'Bangalore'],
    ['Mumbai', 'Bhopal'], ['Bhopal', 'Mumbai'],
    ['Hyderabad', 'Bhopal'], ['Bhopal', 'Hyderabad'],
    ['Pune', 'Bhopal'], ['Bhopal', 'Pune'],
    ['Nagpur', 'Bhopal'], ['Bhopal', 'Nagpur'],
    ['Indore', 'Nagpur'], ['Nagpur', 'Indore'],
    ['Delhi', 'Indore'], ['Indore', 'Delhi'],
];

const PRICE_MAP = {
    SEATER: { base: 250, vary: 300 },
    AC_SEATER: { base: 400, vary: 400 },
    SLEEPER: { base: 500, vary: 400 },
    AC_SLEEPER: { base: 700, vary: 600 },
};

/* ── Generate buses for every route ── */
let busId = 1;
export const MOCK_BUSES = [];

ROUTE_PAIRS.forEach(([from, to]) => {
    // 2–4 buses per route across multiple dates
    const count = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
        const busType = BUS_TYPES[(busId + i) % 4];
        const { base, vary } = PRICE_MAP[busType];
        const price = base + Math.floor(Math.random() * vary);
        const totalSeats = busType.includes('SLEEPER') ? 36 : 40 + (i % 2) * 5;
        const booked = Math.floor(Math.random() * (totalSeats * 0.6));
        const timeSlot = TIMES[(busId + i) % TIMES.length];
        const dateIdx = i % nextDays.length;

        const rating = (4.0 + Math.random()).toFixed(1);

        MOCK_BUSES.push({
            id: busId,
            bus_number: `RX-${String(busId).padStart(3, '0')}`,
            operator_name: OPERATORS[(busId - 1) % OPERATORS.length],
            source_city: from,
            destination_city: to,
            journey_date: nextDays[dateIdx],
            departure_time: timeSlot.dep,
            arrival_time: timeSlot.arr,
            total_seats: totalSeats,
            available_seats: Math.max(0, totalSeats - booked),
            price_per_seat: price,
            bus_type: busType,
            rating: parseFloat(rating > 5.0 ? 5.0 : rating)
        });
        busId++;
    }
});

/* ── Search function — fuzzy city match, always returns all 4 types ── */
export function searchMockBuses(source, dest, journeyDate) {
    const q = (s) => (s || '').toLowerCase().trim();

    let results = MOCK_BUSES.filter(b => {
        const srcMatch = !source || b.source_city.toLowerCase().includes(q(source));
        const destMatch = !dest || b.destination_city.toLowerCase().includes(q(dest));
        return srcMatch && destMatch;
    });

    // If journeyDate provided, prefer buses on that date
    if (journeyDate && results.length > 0) {
        const dateFiltered = results.filter(b => b.journey_date === journeyDate);
        if (dateFiltered.length > 0) results = dateFiltered;
    }

    // Always ensure all 4 bus types are represented
    const existingTypes = new Set(results.map(b => b.bus_type));
    const s = source || 'Mumbai';
    const d = dest || 'Pune';
    const day = journeyDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const FILL = [
        { type: 'SEATER', op: 'VRL Travels', dep: '08:00', arr: '14:00', price: 350, seats: 40 },
        { type: 'AC_SEATER', op: 'ExpressBus India', dep: '10:00', arr: '16:30', price: 550, seats: 40 },
        { type: 'SLEEPER', op: 'KPN Travels', dep: '22:00', arr: '07:00', price: 600, seats: 36 },
        { type: 'AC_SLEEPER', op: 'Orange Travels', dep: '21:00', arr: '06:30', price: 850, seats: 36 },
    ];

    FILL.forEach((f, i) => {
        if (!existingTypes.has(f.type)) {
            results.push({
                id: 9900 + i,
                bus_number: `RX-D0${i + 1}`,
                operator_name: f.op,
                source_city: s, destination_city: d,
                journey_date: day,
                departure_time: f.dep, arrival_time: f.arr,
                total_seats: f.seats,
                available_seats: Math.floor(f.seats * (.3 + i * .1)),
                price_per_seat: f.price,
                bus_type: f.type,
                rating: 4.5, // default reliable rating
            });
        }
    });

    return results.slice(0, 12);
}

/* ── Generate seat map for a bus ─────────────────────── */
export function getMockSeats(busId, totalSeats = 40) {
    const id = parseInt(busId);
    // Deterministic but varied booked/locked pattern based on busId
    const bookedNums = [2, 5, 8, 11, 14, 17].map(n => (n + id) % totalSeats + 1);
    const lockedNums = [3, 9, 15, 21].map(n => (n + id) % totalSeats + 1);

    return Array.from({ length: totalSeats }, (_, i) => {
        const n = i + 1;
        const status = bookedNums.includes(n) ? 'BOOKED'
            : lockedNums.includes(n) ? 'LOCKED'
                : 'AVAILABLE';
        return { seat_number: n, status };
    });
}

/* ── Mock user / token ── */
export const MOCK_USER = {
    id: 1,
    name: 'Demo User',
    email: 'demo@routexen.com',
    phone_number: '9999999999',
    is_admin: false,
};

export const MOCK_TOKEN = 'mock-jwt-demo-routexen';
