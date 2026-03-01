import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ConfirmationPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const bookings = state?.bookings || (state?.booking ? [state.booking] : []);
    const bus = state?.bus;
    const payments = state?.payments || (state?.payment ? [state.payment] : []);
    const passengerName = state?.passengerName || '';
    const passengerPhone = state?.passengerPhone || '';
    const passengerEmail = state?.passengerEmail || '';
    const passengerAge = state?.passengerAge || '';
    const passengerGender = state?.passengerGender || '';

    const [notifMsg, setNotifMsg] = useState('');
    const [confirmed, setConfirmed] = useState(false);

    const totalAmount = bookings.reduce((s, b) => s + b.total_amount, 0);
    const bookingTime = bookings[0]?.booking_time
        ? new Date(bookings[0].booking_time).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        : new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    useEffect(() => {
        if (!bookings.length) return;
        const firstId = bookings[0].id;
        let attempts = 0;
        const poll = async () => {
            attempts++;
            try {
                const { data } = await api.get('/api/notifications/');
                if (data?.length > 0) {
                    const hit = data.find(n => n.message.includes(`#${firstId}`));
                    if (hit) {
                        setNotifMsg(hit.message);
                        setConfirmed(true);
                        return; // stop
                    }
                }
            } catch (_) { }
            if (attempts < 15) setTimeout(poll, 1500);
        };
        poll(); // poll immediately on mount
    }, []);

    if (!bookings.length || !bus || !payments.length) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#64748b', marginBottom: 16 }}>Invalid confirmation data.</p>
                    <button className="btn btn-red" onClick={() => navigate('/search')}>Search Buses</button>
                </div>
            </div>
        );
    }

    return (
        <div className="page" style={{ background: confirmed ? '#f0fdf4' : '#f8f9fb' }}>
            <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
                {/* Success Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 88, height: 88,
                        background: confirmed ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'linear-gradient(135deg,#f59e0b,#d97706)',
                        borderRadius: '50%',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem', boxShadow: confirmed ? '0 10px 40px rgba(22,163,74,.35)' : '0 10px 40px rgba(245,158,11,.35)',
                        transition: 'all .5s',
                    }}>
                        {confirmed ? '✅' : '⏳'}
                    </div>
                    <h1 style={{
                        fontSize: '2rem', fontWeight: 900, marginTop: 20, marginBottom: 8,
                        color: confirmed ? '#15803d' : '#92400e',
                    }}>
                        {confirmed ? 'Booking Confirmed!' : 'Payment Successful!'}
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '.95rem' }}>
                        {confirmed
                            ? 'Your ticket has been confirmed. Have a great journey! 🚌'
                            : 'Confirming your booking in the background...'}
                    </p>
                </div>

                {/* Notification */}
                {notifMsg
                    ? <div className="alert alert-success" style={{ marginBottom: 20, fontSize: '.9rem' }}>🎉 {notifMsg}</div>
                    : <div className="alert alert-info" style={{ marginBottom: 20, fontSize: '.9rem' }}>✅ Your booking is confirmed! Checking notification status...</div>
                }

                {/* Ticket Card */}
                <div className="card" style={{ overflow: 'hidden', marginBottom: 20 }}>
                    {/* Red header strip */}
                    <div style={{ background: 'linear-gradient(135deg, #e8192c, #b91c1c)', padding: '24px 28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ color: 'rgba(255,255,255,.7)', fontSize: '.75rem', marginBottom: 4, letterSpacing: '.06em' }}>BOOKING ID(S)</div>
                                <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900 }}>
                                    #{bookings.map(b => b.id).join(', #')}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    display: 'inline-block', padding: '5px 14px', borderRadius: 999,
                                    background: 'rgba(255,255,255,.2)', color: '#fff',
                                    fontSize: '.75rem', fontWeight: 700, border: '1px solid rgba(255,255,255,.3)',
                                }}>
                                    {payments[0]?.payment_status}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,.6)', fontSize: '.75rem', marginTop: 6 }}>
                                    via {payments[0]?.payment_method?.replace('_', ' ')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ticket body */}
                    <div style={{ padding: '24px 28px' }}>
                        {/* Route */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                            <div>
                                <div style={{ fontSize: '.72rem', color: '#94a3b8', letterSpacing: '.06em' }}>FROM</div>
                                <div style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-.03em' }}>{bus.source_city}</div>
                                <div style={{ color: '#64748b', fontSize: '.9rem', marginTop: 2 }}>🕐 {bus.departure_time}</div>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <div style={{ height: 2, background: 'linear-gradient(to right, #e8192c, #94a3b8, #e8192c)', width: '100%', borderRadius: 999 }} />
                                <div style={{ fontSize: '.72rem', color: '#94a3b8' }}>🚌 Direct</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '.72rem', color: '#94a3b8', letterSpacing: '.06em' }}>TO</div>
                                <div style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-.03em' }}>{bus.destination_city}</div>
                                <div style={{ color: '#64748b', fontSize: '.9rem', marginTop: 2 }}>🕐 {bus.arrival_time}</div>
                            </div>
                        </div>

                        {/* Dashed divider */}
                        <div style={{ margin: '0 -12px 20px', position: 'relative' }}>
                            <div style={{ height: 0, borderTop: '2px dashed #e4e7ed' }} />
                            <div style={{ position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, background: '#f8f9fb', borderRadius: '50%', border: '2px solid #e4e7ed' }} />
                            <div style={{ position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, background: '#f8f9fb', borderRadius: '50%', border: '2px solid #e4e7ed' }} />
                        </div>

                        {/* Details grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                            {[
                                { label: 'Passenger', value: passengerName || 'N/A' },
                                { label: 'Booking Date', value: bookingTime },
                                { label: 'Journey Date', value: String(bus.journey_date) },
                                { label: 'Operator', value: bus.operator_name },
                                { label: 'Bus Number', value: bus.bus_number },
                                { label: 'Bus Type', value: bus.bus_type?.replace('_', ' ') },
                                { label: `Seat${bookings.length > 1 ? 's' : ''}`, value: bookings.map(b => `#${b.seat_number}`).join(', ') },
                                { label: 'Passengers', value: String(bookings.length) },
                                { label: 'Total Paid', value: `₹${totalAmount.toFixed(2)}` },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <div style={{ fontSize: '.72rem', color: '#94a3b8', marginBottom: 3, letterSpacing: '.05em' }}>{label.toUpperCase()}</div>
                                    <div style={{ fontWeight: 700, fontSize: '.9rem', color: '#1e293b' }}>{value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Passenger extra info */}
                        {(passengerAge || passengerGender || passengerPhone || passengerEmail) && (
                            <div style={{
                                marginTop: 20, padding: '12px 16px', background: '#f8f9fb',
                                borderRadius: 8, border: '1px solid #e4e7ed', fontSize: '.85rem',
                            }}>
                                <span style={{ fontWeight: 600, color: '#64748b' }}>
                                    Passenger Info:&nbsp;
                                </span>
                                {[
                                    passengerAge && `Age ${passengerAge}`,
                                    passengerGender,
                                    passengerPhone && `📞 ${passengerPhone}`,
                                    passengerEmail && `✉️ ${passengerEmail}`
                                ].filter(Boolean).join('  ·  ')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12 }}>
                    <button
                        className="btn btn-outline-red btn-full"
                        onClick={() => navigate('/my-bookings')}
                    >
                        View All Bookings
                    </button>
                    <button
                        className="btn btn-red btn-full"
                        onClick={() => navigate('/search')}
                    >
                        Book Another Trip →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;
