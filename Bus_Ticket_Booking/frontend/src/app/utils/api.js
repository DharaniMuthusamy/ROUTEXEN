// API service layer for connecting frontend to FastAPI backend
// All requests are proxied through Vite: /api/* → http://localhost:8000/*

const API_BASE = '/api';

// ─── Token Helpers ───────────────────────────────────────────────────

export function getToken() {
    return localStorage.getItem('access_token');
}

export function setToken(token) {
    localStorage.setItem('access_token', token);
}

export function removeToken() {
    localStorage.removeItem('access_token');
}

function authHeaders() {
    const token = getToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
}

// ─── City ↔ Airport Code Mapping ────────────────────────────────────

const CITY_TO_CODE = {
    'Chennai': 'MAA',
    'Delhi': 'DEL',
    'Mumbai': 'BOM',
    'Bangalore': 'BLR',
    'Hyderabad': 'HYD',
    'Kolkata': 'CCU',
    'Goa': 'GOI',
    'Kochi': 'COK',
    'Pune': 'PNQ',
    'Ahmedabad': 'AMD',
    'Jaipur': 'JAI',
    'Guwahati': 'GAU',
};

const CODE_TO_CITY = Object.fromEntries(
    Object.entries(CITY_TO_CODE).map(([city, code]) => [code, city])
);

export function cityToCode(city) {
    return CITY_TO_CODE[city] || city;
}

export function codeToCity(code) {
    return CODE_TO_CITY[code] || code;
}

// ─── Response Handler ────────────────────────────────────────────────

async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API error: ${response.status}`);
    }
    return response.json();
}

// ─── Auth API Functions ──────────────────────────────────────────────

export async function signup(name, email, password) {
    const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
}

export async function login(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
}

export async function getMe() {
    const response = await fetch(`${API_BASE}/auth/me`, {
        headers: { ...authHeaders() },
    });
    return handleResponse(response);
}

// ─── Flight API Functions ────────────────────────────────────────────

export async function searchFlights(from, to, date) {
    const fromCode = cityToCode(from);
    const toCode = cityToCode(to);
    const params = new URLSearchParams({ from: fromCode, to: toCode, date });
    const response = await fetch(`${API_BASE}/flights?${params}`);
    return handleResponse(response);
}

export async function getFlightById(id) {
    const response = await fetch(`${API_BASE}/flights/${id}`);
    return handleResponse(response);
}

// ─── Seat API Functions ──────────────────────────────────────────────

export async function getSeats(flightId) {
    const response = await fetch(`${API_BASE}/flights/${flightId}/seats`);
    return handleResponse(response);
}

export async function holdSeat(flightId, seatNo, passengerCount = null) {
    const params = passengerCount ? `?passenger_count=${passengerCount}` : '';
    const response = await fetch(`${API_BASE}/flights/${flightId}/hold-seat${params}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
        },
        body: JSON.stringify({ seat_no: seatNo }),
    });
    return handleResponse(response);
}

export async function releaseSeat(flightId, seatNo) {
    const response = await fetch(`${API_BASE}/flights/${flightId}/release-seat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
        },
        body: JSON.stringify({ seat_no: seatNo }),
    });
    return handleResponse(response);
}

export async function getHoldStatus(flightId) {
    const response = await fetch(`${API_BASE}/flights/${flightId}/hold-status`, {
        headers: { ...authHeaders() },
    });
    return handleResponse(response);
}

// Legacy lock function — kept for backwards compatibility
export async function lockSeat(flightId, seatNo, userId = 1) {
    return holdSeat(flightId, seatNo);
}

// ─── Booking API Functions ───────────────────────────────────────────

export async function createBooking(flightId, seatNos, totalAmount, passengerData = {}) {
    const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
        },
        body: JSON.stringify({
            flight_id: flightId,
            seat_nos: seatNos,
            total_amount: totalAmount,
            passenger_name: passengerData.firstName
                ? `${passengerData.firstName} ${passengerData.lastName || ''}`
                : undefined,
            passenger_email: passengerData.email || undefined,
            passenger_phone: passengerData.phone || undefined,
        }),
    });
    return handleResponse(response);
}

export async function getMyTrips() {
    const response = await fetch(`${API_BASE}/my-trips`, {
        headers: { ...authHeaders() },
    });
    return handleResponse(response);
}

export async function cancelBooking(bookingId) {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { ...authHeaders() },
    });
    return handleResponse(response);
}

// ─── Airport API ─────────────────────────────────────────────────────

export async function getAirports() {
    const response = await fetch(`${API_BASE}/airports`);
    return handleResponse(response);
}

// ─── Helpers: Convert API response to frontend Flight shape ─────────

function extractAirlineCode(flightNumber) {
    const parts = flightNumber.split('-');
    return parts[0] || flightNumber.substring(0, 2);
}

function formatTime(time) {
    if (!time) return '';
    const parts = time.split(':');
    return `${parts[0]}:${parts[1]}`;
}

function calculateDuration(dep, arr) {
    const [depH, depM] = dep.split(':').map(Number);
    const [arrH, arrM] = arr.split(':').map(Number);
    let totalMinutes = (arrH * 60 + arrM) - (depH * 60 + depM);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
}

export function apiFlightToFrontend(apiFlight) {
    const depTime = formatTime(apiFlight.departure_time);
    const arrTime = formatTime(apiFlight.arrival_time);

    return {
        id: String(apiFlight.id),
        airline: apiFlight.airline,
        logo: extractAirlineCode(apiFlight.flight_number),
        flightNumber: apiFlight.flight_number,
        departure: codeToCity(apiFlight.from_airport),
        arrival: codeToCity(apiFlight.to_airport),
        departureTime: depTime,
        arrivalTime: arrTime,
        duration: calculateDuration(apiFlight.departure_time, apiFlight.arrival_time),
        stops: 0,
        price: apiFlight.base_price,
    };
}
