import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_CITIES = [
    'Ahmedabad', 'Bangalore', 'Bhopal', 'Bhubaneswar', 'Chennai',
    'Coimbatore', 'Delhi', 'Goa', 'Hyderabad', 'Indore',
    'Jaipur', 'Kolkata', 'Lucknow', 'Mumbai', 'Nagpur',
    'Patna', 'Pune', 'Surat', 'Visakhapatnam', 'Vadodara',
];

const CityInput = ({ id, label, placeholder, value, onChange, cities }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(value);
    const ref = useRef(null);

    useEffect(() => { setQuery(value); }, [value]);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const sourceList = Array.isArray(cities) && cities.length ? cities : DEFAULT_CITIES;
    const filtered = sourceList.filter(c => c.toLowerCase().includes(query.toLowerCase())).slice(0, 12);

    const select = (city) => { onChange(city); setQuery(city); setOpen(false); };

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <div className="input-label" style={{ marginBottom: 8, color: '#94a3b8', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.07em' }}>{label}</div>
            <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8', zIndex: 1 }}>📍</span>
                <input
                    id={id}
                    type="text"
                    value={query}
                    placeholder={placeholder}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    style={{
                        width: '100%', padding: '14px 16px 14px 40px',
                        border: '2px solid rgba(255,255,255,.15)',
                        borderRadius: 8, fontSize: '.95rem',
                        background: 'rgba(255,255,255,.08)',
                        color: '#fff', outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'border-color .18s',
                    }}
                    onMouseEnter={(e) => e.target.style.borderColor = 'rgba(255,255,255,.3)'}
                    onMouseLeave={(e) => !e.target.matches(':focus') && (e.target.style.borderColor = 'rgba(255,255,255,.15)')}
                />
            </div>
            {open && filtered.length > 0 && (
                <div className="autocomplete-list">
                    {filtered.map(city => (
                        <div key={city} className="autocomplete-item" onMouseDown={() => select(city)}>
                            📍 {city}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SearchPage = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState(today);
    const [error, setError] = useState('');
    const [places, setPlaces] = useState([]);
    const [placesError, setPlacesError] = useState(null);

    useEffect(() => {
        // fetch places from backend; fall back to defaults
        fetch('/api/places/')
            .then((r) => {
                if (!r.ok) throw new Error('Failed to load places');
                return r.json();
            })
            .then((data) => setPlaces(data))
            .catch((err) => {
                console.warn('Could not load places:', err);
                setPlaces(DEFAULT_CITIES);
                setPlacesError(err.message || String(err));
            });
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!from) { setError('Please select source city'); return; }
        if (!to) { setError('Please select destination city'); return; }
        if (!date) { setError('Please select journey date'); return; }
        if (from === to) { setError('Source and destination cannot be the same'); return; }
        navigate(`/results?source_city=${encodeURIComponent(from)}&destination_city=${encodeURIComponent(to)}&journey_date=${date}`);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(140deg, #0a0f1e 0%, #14213d 50%, #1a0a12 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', position: 'relative', overflow: 'hidden',
        }}>
            {/* Glow blobs */}
            <div style={{ position: 'absolute', top: '20%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,25,44,.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 720 }}>
                {/* Title */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900,
                        color: '#fff', letterSpacing: '-.04em', marginBottom: 12,
                    }}>
                        Where are we heading?
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '1rem' }}>
                        Search hundreds of routes to find the best journey.
                    </p>
                </div>

                {/* Search Card */}
                <div style={{
                    background: 'rgba(255,255,255,.07)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,.12)',
                    borderRadius: 20, padding: '40px',
                    boxShadow: '0 24px 64px rgba(0,0,0,.4)',
                }}>
                    {error && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '11px 16px', background: 'rgba(232,25,44,.15)',
                            border: '1px solid rgba(232,25,44,.3)', borderRadius: 8,
                            color: '#fca5a5', fontSize: '.88rem', marginBottom: 20,
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSearch}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
                            {/* FROM */}
                            <CityInput
                                id="search-from"
                                label="FROM LOCATION"
                                placeholder="Source City"
                                value={from}
                                onChange={setFrom}
                                cities={places}
                            />

                            {/* TO */}
                            <CityInput
                                id="search-to"
                                label="TO DESTINATION"
                                placeholder="Destination City"
                                value={to}
                                onChange={setTo}
                                cities={places}
                            />

                            {/* DATE */}
                            <div>
                                <div style={{ marginBottom: 8, color: '#94a3b8', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.07em' }}>JOURNEY DATE</div>
                                <input
                                    id="search-date"
                                    type="date"
                                    value={date}
                                    min={today}
                                    onChange={(e) => setDate(e.target.value)}
                                    style={{
                                        width: '100%', padding: '14px 16px',
                                        border: '2px solid rgba(255,255,255,.15)',
                                        borderRadius: 8, fontSize: '.92rem',
                                        background: 'rgba(255,255,255,.08)',
                                        color: '#fff', outline: 'none',
                                        fontFamily: 'Inter, sans-serif',
                                        colorScheme: 'dark',
                                    }}
                                />
                            </div>

                            {/* SEARCH BTN */}
                            <button
                                id="search-btn"
                                type="submit"
                                className="btn btn-red btn-lg"
                                style={{ height: 52, borderRadius: 8, paddingLeft: 28, paddingRight: 28 }}
                            >
                                Search Buses
                            </button>
                        </div>
                    </form>
                </div>

                {/* Popular Routes */}
                <div style={{ marginTop: 48 }}>
                    <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.8rem', marginBottom: 16, textAlign: 'center', letterSpacing: '.06em' }}>
                        POPULAR ROUTES
                    </p>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                            ['Chennai', 'Coimbatore'], ['Chennai', 'Madurai'], ['Coimbatore', 'Madurai'],
                            ['Chennai', 'Trichy'], ['Bangalore', 'Chennai'],
                        ].map(([f, t]) => (
                            <button
                                key={`${f}-${t}`}
                                onClick={() => { setFrom(f); setTo(t); navigate(`/results?source_city=${f}&destination_city=${t}&journey_date=${today}`); }}
                                style={{
                                    padding: '8px 18px', borderRadius: 999,
                                    background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)',
                                    color: 'rgba(255,255,255,.7)', fontSize: '.82rem', cursor: 'pointer',
                                    fontFamily: 'Inter, sans-serif', transition: 'all .18s',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(232,25,44,.2)'; e.currentTarget.style.borderColor = 'rgba(232,25,44,.4)'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)'; e.currentTarget.style.color = 'rgba(255,255,255,.7)'; }}
                            >
                                {f} → {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
