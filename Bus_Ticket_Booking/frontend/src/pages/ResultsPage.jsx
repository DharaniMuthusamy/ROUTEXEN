import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { searchMockBuses } from '../services/mockData';

const TYPE_FILTERS = [
    { id: 'ALL', label: 'All Buses' },
    { id: 'AC_SEATER', label: '🌬️ AC Seater' },
    { id: 'SEATER', label: '💺 Non-AC Seater' },
    { id: 'AC_SLEEPER', label: '❄️ AC Sleeper' },
    { id: 'SLEEPER', label: '🛏️ Non-AC Sleeper' },
];

const TYPE_LABELS = {
    SEATER: { label: 'Non-AC Seater', badge: 'badge-blue', icon: '💺' },
    SLEEPER: { label: 'Non-AC Sleeper', badge: 'badge-purple', icon: '🛏️' },
    AC_SEATER: { label: 'AC Seater', badge: 'badge-green', icon: '🌬️' },
    AC_SLEEPER: { label: 'AC Sleeper', badge: 'badge-amber', icon: '❄️' },
};

const ResultsPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const source = searchParams.get('source_city') || '';
    const dest = searchParams.get('destination_city') || '';
    const date = searchParams.get('journey_date') || '';

    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isMock, setIsMock] = useState(false);
    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => {
        const fetchBuses = async () => {
            setLoading(true); setError(''); setIsMock(false);
            try {
                const params = { source_city: source, destination_city: dest, journey_date: date };
                if (activeFilter && activeFilter !== 'ALL') params.bus_type = activeFilter;
                const { data } = await api.get('/api/buses/search', { params });
                setBuses(data);
            } catch (err) {
                // If backend is not reachable, fall back to mock data
                if (err.isNetworkError || err.code === 'ERR_NETWORK' || !err.response) {
                    const mock = searchMockBuses(source, dest, date);
                    // apply active filter to mock as well
                    const applied = activeFilter && activeFilter !== 'ALL' ? mock.filter(b => b.bus_type === activeFilter) : mock;
                    setBuses(applied);
                    setIsMock(true);
                } else {
                    setError('Failed to load buses. Please try again.');
                }
            } finally { setLoading(false); }
        };
        // only fetch when basic query params present
        if (source && dest && date) fetchBuses();
        else { setBuses([]); setLoading(false); }
    }, [source, dest, date, activeFilter]);

    const filtered = activeFilter === 'ALL' ? buses : buses.filter(b => b.bus_type === activeFilter);

    const handleSelect = (bus) => {
        if (!localStorage.getItem('token')) { navigate('/login'); return; }
        navigate(`/seats/${bus.id}`, { state: { bus } });
    };

    const formatDate = (d) => {
        if (!d) return '';
        return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="page">
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)', padding: '32px 0' }}>
                <div className="container">
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/search')} style={{ marginBottom: 14 }}>
                        ← Back to Search
                    </button>
                    <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-.03em' }}>
                        {source} <span style={{ color: '#818cf8' }}>→</span> {dest}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,.5)', marginTop: 6, fontSize: '.9rem' }}>
                        📅 {formatDate(date)}
                        &nbsp;·&nbsp;
                        <span style={{ color: loading ? 'rgba(255,255,255,.4)' : '#818cf8', fontWeight: 600 }}>
                            {loading ? 'Searching...' : `${filtered.length} bus${filtered.length !== 1 ? 'es' : ''} found`}
                        </span>
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: '28px 24px' }}>
                {/* Mock data banner */}
                {isMock && (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: 8,
                        padding: '12px 16px', background: '#fff7ed',
                        border: '1px solid #fed7aa', borderRadius: 8, marginBottom: 16, fontSize: '.85rem',
                    }}>
                        <span style={{ color: '#92400e' }}>
                            🎭 <strong>Demo Mode</strong> — Showing sample data. Start the backend for live data.
                        </span>
                        <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer"
                            style={{ color: '#c2410c', fontWeight: 700, fontSize: '.8rem' }}>
                            Start backend →
                        </a>
                    </div>
                )}

                {/* Filters */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '.8rem', fontWeight: 700, color: '#64748b', letterSpacing: '.06em' }}>FILTER BY TYPE:</span>
                        <div className="filter-tabs">
                            {TYPE_FILTERS.map(f => (
                                <button
                                    key={f.id}
                                    className={`filter-tab ${activeFilter === f.id ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(f.id)}
                                >
                                    {f.label} {activeFilter !== 'ALL' && f.id !== 'ALL' && f.id === activeFilter
                                        ? `(${filtered.length})` : ''}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="loading-center">
                        <div style={{ textAlign: 'center' }}>
                            <div className="spinner" style={{ margin: '0 auto 16px' }} />
                            <p style={{ color: '#64748b' }}>Searching for the best buses...</p>
                        </div>
                    </div>
                )}

                {error && <div className="alert alert-error">{error}</div>}

                {!loading && !error && filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🚌</div>
                        <h2 style={{ fontWeight: 800, marginBottom: 8 }}>
                            {buses.length > 0 ? 'No buses match this filter' : 'No buses found'}
                        </h2>
                        <p style={{ color: '#64748b', marginBottom: 24 }}>
                            {buses.length > 0
                                ? `${buses.length} bus${buses.length > 1 ? 'es' : ''} available — try removing the filter`
                                : 'Try a different route or date'}
                        </p>
                        {buses.length > 0
                            ? <button className="btn btn-outline-red" onClick={() => setActiveFilter('ALL')}>Clear Filter</button>
                            : <button className="btn btn-red" onClick={() => navigate('/search')}>Search Again</button>
                        }
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {filtered.map(bus => (
                            <BusCard key={bus.id} bus={bus} onSelect={() => handleSelect(bus)} isMock={isMock} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const BusCard = ({ bus, onSelect, isMock }) => {
    const t = TYPE_LABELS[bus.bus_type] || TYPE_LABELS.SEATER;
    const avail = bus.available_seats ?? bus.total_seats;
    const availPct = bus.total_seats ? (avail / bus.total_seats) * 100 : 100;
    const availColor = availPct > 50 ? '#16a34a' : availPct > 20 ? '#d97706' : '#e8192c';

    return (
        <div className="card" style={{ padding: '24px 28px', transition: 'all .18s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,.13)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
        >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>
                <div>
                    {/* Operator row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <div style={{
                            width: 46, height: 46, background: '#f0eeff', borderRadius: 11,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0,
                        }}>{t.icon}</div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{bus.operator_name}</div>
                                <div style={{
                                    background: '#16a34a', color: '#fff', fontSize: '.75rem', fontWeight: 800,
                                    padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4
                                }}>
                                    <span>★</span> {bus.rating ? bus.rating.toFixed(1) : '4.5'}
                                </div>
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '.78rem', marginTop: 2 }}>Bus #{bus.bus_number}</div>
                        </div>
                    </div>

                    {/* Route timing */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-.02em' }}>{bus.departure_time}</div>
                            <div style={{ color: '#64748b', fontSize: '.8rem', marginTop: 2 }}>{bus.source_city}</div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 2, background: 'linear-gradient(to right, #6366f1, #94a3b8)' }} />
                            <span style={{ fontSize: '.7rem', padding: '3px 8px', background: '#f0eeff', borderRadius: 999, color: '#6366f1', border: '1px solid #c7d2fe' }}>🚌 Direct</span>
                            <div style={{ flex: 1, height: 2, background: 'linear-gradient(to right, #94a3b8, #6366f1)' }} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-.02em' }}>{bus.arrival_time}</div>
                            <div style={{ color: '#64748b', fontSize: '.8rem', marginTop: 2 }}>{bus.destination_city}</div>
                        </div>
                    </div>

                    {/* Badges */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span className={`badge ${t.badge}`}>{t.label}</span>
                        <span className="badge" style={{ background: '#f0fdf4', color: availColor }}>
                            {avail} seats left
                        </span>
                        <span className="badge badge-blue">📅 {String(bus.journey_date)}</span>
                        {isMock && <span className="badge badge-amber">🎭 Demo</span>}
                    </div>
                </div>

                {/* Price + CTA */}
                <div style={{ textAlign: 'center', minWidth: 150 }}>
                    <div style={{ fontSize: '.7rem', color: '#94a3b8', marginBottom: 2, letterSpacing: '.04em' }}>STARTS FROM</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#6366f1', lineHeight: 1, letterSpacing: '-.03em' }}>
                        ₹{Math.floor(bus.price_per_seat)}
                    </div>
                    <div style={{ fontSize: '.7rem', color: '#94a3b8', marginBottom: 16 }}>per seat</div>
                    <button
                        id={`select-bus-${bus.id}`}
                        className="btn btn-sm"
                        onClick={onSelect}
                        disabled={avail === 0}
                        style={{
                            width: '100%', borderRadius: 8,
                            background: avail === 0 ? '#f1f5f9' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            color: avail === 0 ? '#94a3b8' : '#fff', border: 'none',
                            boxShadow: avail > 0 ? '0 4px 12px rgba(99,102,241,.4)' : 'none',
                        }}
                    >
                        {avail === 0 ? 'Sold Out' : 'Select Seats →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
