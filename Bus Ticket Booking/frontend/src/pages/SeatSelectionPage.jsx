import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { getMockSeats, MOCK_BUSES } from '../services/mockData';

/* ─── Helpers ─── */
const isSleeper = (type) => type === 'SLEEPER' || type === 'AC_SLEEPER';
const isAC = (type) => type === 'AC_SEATER' || type === 'AC_SLEEPER';

/* ─── Seater Grid: 2+2 layout ─── */
const SeaterGrid = ({ seats, selected, onToggle }) => {
    const COLS = 4; // 2 left | aisle | 2 right
    const rows = Math.ceil(seats.length / COLS);

    const getStatus = (s) => {
        if (!s) return 'empty';
        if (selected.includes(s.seat_number)) return 'selected';
        return s.status?.toLowerCase() || 'available';
    };

    const tileStyle = (status) => {
        const base = { width: 44, height: 44, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem', fontWeight: 700, border: '2px solid', transition: 'all .13s', cursor: 'pointer', userSelect: 'none', position: 'relative' };
        if (status === 'selected') return { ...base, background: '#e8192c', borderColor: '#b91c1c', color: '#fff', transform: 'scale(1.1)' };
        if (status === 'booked') return { ...base, background: '#fee2e2', borderColor: '#f87171', color: '#b91c1c', cursor: 'not-allowed' };
        if (status === 'locked') return { ...base, background: '#fef3c7', borderColor: '#fcd34d', color: '#92400e', cursor: 'not-allowed' };
        return { ...base, background: '#d1fae5', borderColor: '#6ee7b7', color: '#065f46', cursor: 'pointer' };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            {Array.from({ length: rows }, (_, r) => {
                const row = seats.slice(r * COLS, r * COLS + COLS);
                return (
                    <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 22, fontSize: '.65rem', color: '#94a3b8', textAlign: 'right', flexShrink: 0 }}>R{r + 1}</span>
                        {[0, 1].map(col => {
                            const s = row[col];
                            const st = getStatus(s);
                            return (
                                <div key={col}
                                    style={tileStyle(st)}
                                    title={s ? `Seat ${s.seat_number}` : ''}
                                    onClick={() => s && st !== 'booked' && st !== 'locked' && onToggle(s.seat_number)}
                                >
                                    {s ? s.seat_number : ''}
                                </div>
                            );
                        })}
                        {/* Aisle */}
                        <div style={{ width: 20, borderLeft: '2px dashed #e4e7ed', height: 20 }} />
                        {[2, 3].map(col => {
                            const s = row[col];
                            const st = getStatus(s);
                            return (
                                <div key={col}
                                    style={tileStyle(st)}
                                    title={s ? `Seat ${s.seat_number}` : ''}
                                    onClick={() => s && st !== 'booked' && st !== 'locked' && onToggle(s.seat_number)}
                                >
                                    {s ? s.seat_number : ''}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

/* ─── Sleeper Grid: 2+1 layout with upper/lower berths ─── */
const SleeperGrid = ({ seats, selected, onToggle }) => {
    // Arrange in pairs: lower(A) + upper(B) per side
    const ROWS = Math.ceil(seats.length / 3); // 3 berths per row in 2+1

    const getStatus = (s) => {
        if (!s) return 'empty';
        if (selected.includes(s.seat_number)) return 'selected';
        return s.status?.toLowerCase() || 'available';
    };

    const berth = (s, label) => {
        if (!s) return <div style={{ width: 80, height: 32 }} />;
        const st = getStatus(s);
        const styles = {
            width: 80, height: 32, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.65rem', fontWeight: 700, border: '2px solid', transition: 'all .13s',
            cursor: st === 'booked' || st === 'locked' ? 'not-allowed' : 'pointer',
            userSelect: 'none',
            background: st === 'selected' ? '#e8192c' : st === 'booked' ? '#fee2e2' : st === 'locked' ? '#fef3c7' : '#d1fae5',
            borderColor: st === 'selected' ? '#b91c1c' : st === 'booked' ? '#f87171' : st === 'locked' ? '#fcd34d' : '#6ee7b7',
            color: st === 'selected' ? '#fff' : st === 'booked' ? '#b91c1c' : st === 'locked' ? '#92400e' : '#065f46',
        };
        return (
            <div style={styles}
                title={`Seat ${s.seat_number} (${label})`}
                onClick={() => st !== 'booked' && st !== 'locked' && onToggle(s.seat_number)}
            >
                {s.seat_number}
                <span style={{ fontSize: '.55rem', marginLeft: 3, opacity: .7 }}>{label}</span>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            {/* Header */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center' }}>
                <div style={{ width: 22 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                    <span style={{ fontSize: '.6rem', color: '#94a3b8', width: 80, textAlign: 'center' }}>LEFT</span>
                </div>
                <div style={{ width: 20 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                    <span style={{ fontSize: '.6rem', color: '#94a3b8', width: 80, textAlign: 'center' }}>RIGHT</span>
                </div>
                <div style={{ width: 20 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                    <span style={{ fontSize: '.6rem', color: '#94a3b8', width: 80, textAlign: 'center' }}>SIDE</span>
                </div>
            </div>
            {Array.from({ length: ROWS }, (_, r) => {
                // 2+1: seats 0,1 left side, seat 2 right side
                const base = r * 3;
                const s = [seats[base], seats[base + 1], seats[base + 2]];
                return (
                    <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 22, fontSize: '.65rem', color: '#94a3b8', textAlign: 'right', flexShrink: 0 }}>R{r + 1}</span>
                        {/* Left side: lower + upper stacked */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {berth(s[0], 'L')}
                            {berth(s[1], 'U')}
                        </div>
                        <div style={{ width: 20, borderLeft: '2px dashed #e4e7ed', height: 36 }} />
                        {/* Right side single berth */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center' }}>
                            {berth(s[2], 'S')}
                            <div style={{ height: 36 }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

/* ─── MAIN COMPONENT ─── */
const SeatSelectionPage = () => {
    const { busId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();

    const [bus, setBus] = useState(state?.bus || null);
    const [seats, setSeats] = useState([]);
    const [selected, setSelected] = useState([]);
    const [maxPassengers, setMaxPassengers] = useState(1);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [isMock, setIsMock] = useState(false);

    // passenger form
    const [passengerName, setPassengerName] = useState('');
    const [passengerEmail, setPassengerEmail] = useState('');
    const [passengerPhone, setPassengerPhone] = useState('');
    const [passengerAge, setPassengerAge] = useState('');
    const [passengerGender, setPassengerGender] = useState('Male');

    useEffect(() => {
        const load = async () => {
            try {
                if (!bus) {
                    const { data } = await api.get(`/api/buses/${busId}`);
                    setBus(data);
                }
                const { data } = await api.get(`/api/buses/${busId}/seats`);
                setSeats(data.seats);
            } catch (err) {
                // Fallback to mock data when offline
                if (err.isNetworkError || err.code === 'ERR_NETWORK' || !err.response) {
                    const mockBus = MOCK_BUSES.find(b => b.id === parseInt(busId));
                    if (mockBus && !bus) setBus(mockBus);
                    const currentBus = bus || mockBus;
                    const mockSeats = getMockSeats(busId, currentBus?.total_seats || 40);
                    setSeats(mockSeats);
                    setIsMock(true);
                } else {
                    setError('Failed to load seat map.');
                }
            }
            finally { setLoading(false); }
        };
        load();
    }, [busId]);

    const toggleSeat = (seatNum) => {
        setSelected(prev => {
            if (prev.includes(seatNum)) return prev.filter(n => n !== seatNum);
            if (prev.length >= maxPassengers) {
                // replace oldest
                return [...prev.slice(1), seatNum];
            }
            return [...prev, seatNum];
        });
    };

    const handleProceed = async () => {
        if (!passengerName.trim()) { setError('Please enter passenger name'); return; }
        if (!passengerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passengerEmail)) { setError('Please enter a valid email address'); return; }
        if (selected.length === 0) { setError('Please select at least one seat'); return; }
        setProcessing(true); setError('');
        try {
            if (isMock) {
                // Demo mode — simulate booking without backend
                const mockBookings = selected.map((seatNum, i) => ({
                    id: 1000 + i, bus_id: parseInt(busId), seat_number: seatNum,
                    total_amount: bus.price_per_seat, booking_status: 'PENDING',
                    booking_time: new Date().toISOString(),
                }));
                navigate('/payment', {
                    state: { bookings: mockBookings, bus, passengerName, passengerEmail, passengerPhone, passengerAge, passengerGender, isMock: true }
                });
                return;
            }
            // Real backend flow
            const bookings = [];
            for (const seatNum of selected) {
                await api.post('/api/bookings/lock-seat', { bus_id: parseInt(busId), seat_number: seatNum });
                const { data: booking } = await api.post('/api/bookings/', { bus_id: parseInt(busId), seat_number: seatNum });
                bookings.push(booking);
            }
            navigate('/payment', {
                state: { bookings, bus, passengerName, passengerEmail, passengerPhone, passengerAge, passengerGender }
            });
        } catch (err) {
            if (err.isNetworkError || err.code === 'ERR_NETWORK' || !err.response) {
                setError('Backend not reachable. Use Demo Mode from the login page.');
            } else {
                setError(err.response?.data?.detail || 'Could not reserve seats. Please try again.');
            }
            setSelected([]);
        } finally { setProcessing(false); }
    };

    const busType = bus?.bus_type || 'SEATER';
    const sleeper = isSleeper(busType);
    const ac = isAC(busType);
    const totalAmount = selected.length * (bus?.price_per_seat || 0);

    if (loading) return (
        <div className="loading-center" style={{ minHeight: '100vh' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: '#64748b' }}>Loading seat map...</p>
            </div>
        </div>
    );

    return (
        <div className="page">
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0a0f1e, #12192e)', padding: '28px 0' }}>
                <div className="container">
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>← Back</button>
                    <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>Choose Your Seats</h1>
                    {bus && (
                        <p style={{ color: 'rgba(255,255,255,.55)', marginTop: 4, fontSize: '.9rem' }}>
                            {bus.operator_name} &nbsp;·&nbsp; {bus.source_city} → {bus.destination_city}
                            &nbsp;·&nbsp; {bus.departure_time}–{bus.arrival_time}
                            &nbsp;·&nbsp; <span style={{ color: ac ? '#6ee7b7' : '#fcd34d' }}>{bus.bus_type?.replace('_', ' ')}</span>
                        </p>
                    )}
                </div>
            </div>

            <div className="container" style={{ padding: '28px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>

                    {/* ── LEFT: Seat Map ── */}
                    <div>
                        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

                        {/* Passenger count selector */}
                        <div className="card" style={{ padding: '20px', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>How many passengers?</div>
                                    <div style={{ fontSize: '.82rem', color: '#64748b' }}>Select up to {maxPassengers} seat{maxPassengers > 1 ? 's' : ''}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    {[1, 2, 3, 4, 5, 6].map(n => (
                                        <button key={n}
                                            onClick={() => { setMaxPassengers(n); setSelected([]); }}
                                            style={{
                                                width: 36, height: 36, borderRadius: 8, border: '2px solid',
                                                borderColor: maxPassengers === n ? '#e8192c' : '#e4e7ed',
                                                background: maxPassengers === n ? '#fef2f2' : '#fff',
                                                color: maxPassengers === n ? '#e8192c' : '#64748b',
                                                fontWeight: 700, fontSize: '.9rem', cursor: 'pointer',
                                                transition: 'all .15s',
                                            }}
                                        >{n}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                            {[['#d1fae5', '#6ee7b7', '#065f46', 'Available'],
                            ['#e8192c', '#b91c1c', '#fff', 'Selected'],
                            ['#fef3c7', '#fcd34d', '#92400e', 'Locked'],
                            ['#fee2e2', '#f87171', '#b91c1c', 'Booked']].map(([bg, bc, tc, label]) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 16, height: 16, borderRadius: 3, background: bg, border: `2px solid ${bc}` }} />
                                    <span style={{ fontSize: '.78rem', color: '#64748b' }}>{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Bus front */}
                        <div style={{
                            textAlign: 'center', padding: '10px 20px',
                            background: 'linear-gradient(135deg, #0a0f1e, #1e293b)',
                            borderRadius: '14px 14px 0 0', color: 'rgba(255,255,255,.7)',
                            fontWeight: 600, fontSize: '.82rem',
                        }}>
                            🚌&nbsp; {sleeper ? 'Sleeper' : 'Seater'} Bus — {bus?.bus_number} — Driver's Cabin (Front)
                            &nbsp;{ac ? '❄️ AC' : ''}
                        </div>

                        <div className="card" style={{ borderRadius: '0 0 14px 14px', padding: '24px', overflowX: 'auto' }}>
                            {sleeper
                                ? <SleeperGrid seats={seats} selected={selected} onToggle={toggleSeat} />
                                : <SeaterGrid seats={seats} selected={selected} onToggle={toggleSeat} />
                            }
                        </div>

                        <div style={{ marginTop: 12, fontSize: '.78rem', color: '#94a3b8', textAlign: 'center' }}>
                            {selected.length === 0
                                ? `Click a green ${sleeper ? 'berth' : 'seat'} to select it`
                                : `Selected: Seat${selected.length > 1 ? 's' : ''} ${selected.join(', ')}`
                            }
                        </div>
                    </div>

                    {/* ── RIGHT: Customer Details + Summary ── */}
                    <div style={{ position: 'sticky', top: 80 }}>
                        {/* Passenger Details */}
                        <div className="card" style={{ padding: '24px', marginBottom: 16 }}>
                            <h3 style={{ fontWeight: 800, marginBottom: 18, fontSize: '1rem' }}>Passenger Details</h3>

                            <div className="input-wrap" style={{ marginBottom: 14 }}>
                                <label className="input-label">Full Name *</label>
                                <input className="input-field" placeholder="e.g. Arjun Sharma"
                                    value={passengerName} onChange={e => setPassengerName(e.target.value)} required />
                            </div>
                            <div className="input-wrap" style={{ marginBottom: 14 }}>
                                <label className="input-label">Email Address *</label>
                                <input className="input-field" placeholder="e.g. name@example.com" type="email"
                                    value={passengerEmail} onChange={e => setPassengerEmail(e.target.value)} required />
                            </div>
                            <div className="input-wrap" style={{ marginBottom: 14 }}>
                                <label className="input-label">Phone Number</label>
                                <input className="input-field" placeholder="9876543210" type="tel"
                                    value={passengerPhone} onChange={e => setPassengerPhone(e.target.value)} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                                <div className="input-wrap">
                                    <label className="input-label">Age</label>
                                    <input className="input-field" placeholder="25" type="number" min="1" max="120"
                                        value={passengerAge} onChange={e => setPassengerAge(e.target.value)} />
                                </div>
                                <div className="input-wrap">
                                    <label className="input-label">Gender</label>
                                    <select className="input-field" value={passengerGender} onChange={e => setPassengerGender(e.target.value)}>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Booking Summary */}
                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ fontWeight: 800, marginBottom: 16, fontSize: '1rem' }}>Booking Summary</h3>

                            {bus && (
                                <div style={{ background: '#f8f9fb', borderRadius: 8, padding: '12px', marginBottom: 16, fontSize: '.88rem' }}>
                                    <div style={{ fontWeight: 700 }}>{bus.source_city} → {bus.destination_city}</div>
                                    <div style={{ color: '#64748b', marginTop: 2 }}>{String(bus.journey_date)} | {bus.departure_time}</div>
                                    <div style={{ color: '#64748b', marginTop: 2 }}>{bus.operator_name} — {bus.bus_type?.replace('_', ' ')}</div>
                                </div>
                            )}

                            <div style={{ fontSize: '.9rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ color: '#64748b' }}>Passengers</span>
                                    <span style={{ fontWeight: 600 }}>{selected.length} / {maxPassengers}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ color: '#64748b' }}>Selected Seats</span>
                                    <span style={{ fontWeight: 600 }}>{selected.length > 0 ? selected.join(', ') : '—'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ color: '#64748b' }}>Price / Seat</span>
                                    <span>₹{bus?.price_per_seat?.toFixed(0) || '—'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ color: '#64748b' }}>Convenience Fee</span>
                                    <span style={{ color: '#16a34a', fontWeight: 600 }}>FREE</span>
                                </div>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    paddingTop: 12, borderTop: '2px solid #e4e7ed', marginTop: 8,
                                }}>
                                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>Total</span>
                                    <span style={{ fontWeight: 900, fontSize: '1.4rem', color: '#e8192c' }}>
                                        ₹{totalAmount.toFixed(0)}
                                    </span>
                                </div>
                            </div>

                            {selected.length === 0 && (
                                <div style={{ padding: '10px', background: '#fef3c7', borderRadius: 6, fontSize: '.82rem', color: '#92400e', marginTop: 12, textAlign: 'center' }}>
                                    👆 Select a {sleeper ? 'berth' : 'seat'} from the map
                                </div>
                            )}

                            <button
                                id="proceed-payment"
                                className="btn btn-red btn-full"
                                style={{ marginTop: 16, padding: '15px', borderRadius: 8, fontSize: '1rem' }}
                                onClick={handleProceed}
                                disabled={selected.length === 0 || processing}
                            >
                                {processing ? '🔒 Reserving...' : `→ Proceed to Payment  ₹${totalAmount.toFixed(0)}`}
                            </button>
                            <p style={{ fontSize: '.72rem', color: '#94a3b8', textAlign: 'center', marginTop: 8 }}>
                                🔒 Seats locked for 2 minutes to prevent double booking
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionPage;
