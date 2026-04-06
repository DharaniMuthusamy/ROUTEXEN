import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const statusColors = {
    CONFIRMED: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
    PENDING: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
    CANCELLED: { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' },
};

const MyBookingsPage = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/api/bookings/my');
                setBookings(data);
            } catch (err) {
                setError('Failed to load bookings.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        setCancelling(bookingId);
        try {
            const { data } = await api.patch(`/api/bookings/${bookingId}/cancel`);
            setBookings((prev) => prev.map((b) => b.id === bookingId ? data : b));
        } catch (err) {
            alert(err.response?.data?.detail || 'Cancellation failed.');
        } finally {
            setCancelling(null);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '40px 24px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800 }}>🎫 My Bookings</h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                        All your bus ticket bookings in one place
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
                {loading && (
                    <div className="loading-center">
                        <div className="spinner" />
                    </div>
                )}

                {error && <div className="alert alert-error">{error}</div>}

                {!loading && !error && bookings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎫</div>
                        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>No bookings yet</h2>
                        <p style={{ color: '#64748b', marginBottom: 24 }}>Book your first bus ticket now!</p>
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/search')}>
                            Search Buses
                        </button>
                    </div>
                )}

                {!loading && !error && bookings.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {bookings.map((booking) => {
                            const sc = statusColors[booking.booking_status] || statusColors.PENDING;
                            const b = booking.bus;
                            return (
                                <div key={booking.id} className="card" style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                                        <div style={{ flex: 1 }}>
                                            {/* Header row */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                                                <span style={{
                                                    display: 'inline-block', padding: '4px 12px', borderRadius: 999,
                                                    background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                                                    fontSize: '0.75rem', fontWeight: 700,
                                                }}>
                                                    {booking.booking_status}
                                                </span>
                                                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                                                    Booking #{booking.id}
                                                </span>
                                            </div>

                                            {/* Route */}
                                            {b ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                                                    <div>
                                                        <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{b.source_city}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.departure_time}</div>
                                                    </div>
                                                    <div style={{ color: '#dc2626', fontSize: '1.2rem', fontWeight: 700 }}>→</div>
                                                    <div>
                                                        <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{b.destination_city}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.arrival_time}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ fontWeight: 600 }}>Bus ID: {booking.bus_id}</div>
                                            )}

                                            {/* Details */}
                                            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 12 }}>
                                                {b && <span style={{ fontSize: '0.85rem', color: '#64748b' }}>📅 {b.journey_date}</span>}
                                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>💺 Seat #{booking.seat_number}</span>
                                                {b && <span style={{ fontSize: '0.85rem', color: '#64748b' }}>🚌 {b.operator_name}</span>}
                                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626' }}>₹{booking.total_amount.toFixed(2)}</span>
                                            </div>

                                            {/* Additional bus details: bus number, driver, boarding and dropping points, time */}
                                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12, color: '#475569' }}>
                                                {b && (
                                                    <>
                                                        <div style={{ fontSize: '0.9rem' }}><strong>Bus No:</strong> {b.bus_number || 'N/A'}</div>
                                                        <div style={{ fontSize: '0.9rem' }}><strong>Driver:</strong> {b.driver_name || 'TBD'}</div>
                                                        <div style={{ fontSize: '0.9rem' }}><strong>Boarding:</strong> {b.boarding_point || b.source_city || 'N/A'}</div>
                                                        <div style={{ fontSize: '0.9rem' }}><strong>Dropping:</strong> {b.dropping_point || b.destination_city || 'N/A'}</div>
                                                        <div style={{ fontSize: '0.9rem' }}><strong>Time:</strong> {b.departure_time} - {b.arrival_time}</div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Cancel button */}
                                        {booking.booking_status !== 'CANCELLED' && (
                                            <button
                                                id={`cancel-booking-${booking.id}`}
                                                className="btn btn-sm"
                                                style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' }}
                                                onClick={() => handleCancel(booking.id)}
                                                disabled={cancelling === booking.id}
                                            >
                                                {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;
