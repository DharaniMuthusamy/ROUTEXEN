import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const METHODS = [
    { id: 'CREDIT_CARD', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
    { id: 'UPI', label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, BHIM' },
    { id: 'NET_BANKING', label: 'Net Banking', icon: '🏦', desc: 'All major Indian banks' },
];

const PaymentPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const bookings = state?.bookings || (state?.booking ? [state.booking] : []);
    const bus = state?.bus;
    const passengerName = state?.passengerName || '';
    const passengerPhone = state?.passengerPhone || '';
    const passengerEmail = state?.passengerEmail || '';
    const passengerAge = state?.passengerAge || '';
    const passengerGender = state?.passengerGender || '';

    const [method, setMethod] = useState('UPI');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    if (!bookings.length || !bus) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#64748b', marginBottom: 16 }}>Invalid payment session.</p>
                    <button className="btn btn-red" onClick={() => navigate('/search')}>Search Buses</button>
                </div>
            </div>
        );
    }

    const totalAmount = bookings.reduce((s, b) => s + b.total_amount, 0);

    const handlePay = async () => {
        setProcessing(true); setError('');
        try {
            await new Promise(r => setTimeout(r, 1500)); // UX processing delay
            const payments = [];
            for (const booking of bookings) {
                const { data } = await api.post('/api/payments/', {
                    booking_id: booking.id,
                    payment_method: method,
                    passenger_email: passengerEmail || undefined,
                    passenger_name: passengerName || undefined
                });
                payments.push(data);
            }
            navigate('/confirmation', {
                state: { bookings, bus, payments, passengerName, passengerEmail, passengerPhone, passengerAge, passengerGender }
            });
        } catch (err) {
            setError(err.response?.data?.detail || 'Payment failed. Please try again.');
        } finally { setProcessing(false); }
    };

    return (
        <div className="page">
            <div style={{ background: 'linear-gradient(135deg, #0a0f1e, #12192e)', padding: '28px 0' }}>
                <div className="container">
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>← Back</button>
                    <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>Secure Payment</h1>
                    <p style={{ color: 'rgba(255,255,255,.5)', marginTop: 4, fontSize: '.88rem' }}>
                        Booking{bookings.length > 1 ? `s: #${bookings.map(b => b.id).join(', #')}` : ` #${bookings[0]?.id}`} — 256-bit encrypted
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: '28px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
                    {/* Left: Method selector */}
                    <div>
                        {error && <div className="alert alert-error">{error}</div>}
                        <div className="card" style={{ padding: '28px', marginBottom: 20 }}>
                            <h3 style={{ fontWeight: 800, marginBottom: 20, fontSize: '1rem' }}>Select Payment Method</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {METHODS.map(m => (
                                    <div
                                        key={m.id}
                                        id={`pay-${m.id}`}
                                        onClick={() => setMethod(m.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 16,
                                            padding: '16px 20px', borderRadius: 10, cursor: 'pointer',
                                            border: `2px solid ${method === m.id ? '#e8192c' : '#e4e7ed'}`,
                                            background: method === m.id ? '#fef2f2' : '#fff',
                                            transition: 'all .15s',
                                        }}
                                    >
                                        <div style={{
                                            width: 48, height: 48, background: '#f8f9fb', borderRadius: 10,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                                        }}>{m.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700 }}>{m.label}</div>
                                            <div style={{ color: '#64748b', fontSize: '.8rem' }}>{m.desc}</div>
                                        </div>
                                        <div style={{
                                            width: 20, height: 20, borderRadius: '50%',
                                            border: `2px solid ${method === m.id ? '#e8192c' : '#cbd5e1'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {method === m.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e8192c' }} />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '13px 16px', background: '#f0fdf4',
                            borderRadius: 8, border: '1px solid #bbf7d0',
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>🔒</span>
                            <span style={{ fontSize: '.85rem', color: '#15803d' }}>
                                256-bit SSL encryption. Your card info is never stored.
                            </span>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="card" style={{ padding: '24px', alignSelf: 'start', position: 'sticky', top: 80 }}>
                        <h3 style={{ fontWeight: 800, marginBottom: 16, fontSize: '1rem' }}>Order Summary</h3>

                        {/* Passenger info */}
                        {passengerName && (
                            <div style={{ background: '#f8f9fb', borderRadius: 8, padding: '12px', marginBottom: 14, fontSize: '.85rem' }}>
                                <div style={{ fontWeight: 700 }}>👤 {passengerName}</div>
                                {passengerEmail && <div style={{ color: '#64748b', marginTop: 2 }}>✉️ {passengerEmail}</div>}
                                {passengerAge && <div style={{ color: '#64748b', marginTop: 2 }}>Age: {passengerAge} · {passengerGender}</div>}
                                {passengerPhone && <div style={{ color: '#64748b', marginTop: 2 }}>📞 {passengerPhone}</div>}
                            </div>
                        )}

                        {/* Route */}
                        <div style={{ background: '#f8f9fb', borderRadius: 8, padding: '12px', marginBottom: 14, fontSize: '.85rem' }}>
                            <div style={{ fontWeight: 700 }}>{bus.operator_name}</div>
                            <div style={{ color: '#64748b', marginTop: 2 }}>{bus.source_city} → {bus.destination_city}</div>
                            <div style={{ color: '#64748b', marginTop: 2 }}>{String(bus.journey_date)} | {bus.departure_time}</div>
                            <div style={{ marginTop: 6, color: '#e8192c', fontWeight: 700 }}>
                                Seat{bookings.length > 1 ? 's' : ''}: {bookings.map(b => `#${b.seat_number}`).join(', ')}
                            </div>
                        </div>

                        <div style={{ fontSize: '.9rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ color: '#64748b' }}>Base Fare × {bookings.length}</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ color: '#64748b' }}>GST &amp; Convenience Fee</span>
                                <span style={{ color: '#16a34a', fontWeight: 600 }}>FREE</span>
                            </div>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                paddingTop: 12, borderTop: '2px solid #e4e7ed', marginTop: 8,
                            }}>
                                <span style={{ fontWeight: 800 }}>Total Payable</span>
                                <span style={{ fontWeight: 900, fontSize: '1.5rem', color: '#e8192c' }}>₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            id="pay-now"
                            className="btn btn-red btn-full"
                            style={{ marginTop: 20, padding: '15px', borderRadius: 8, fontSize: '1rem' }}
                            onClick={handlePay}
                            disabled={processing}
                        >
                            {processing ? '⏳ Processing...' : `💳  Pay ₹${totalAmount.toFixed(2)}`}
                        </button>
                        <p style={{ fontSize: '.72rem', color: '#94a3b8', textAlign: 'center', marginTop: 8 }}>
                            🎫 Ticket confirmed instantly after payment
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
