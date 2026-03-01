import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminCreateBusPage = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        bus_number: '', operator_name: '', source_city: '', destination_city: '',
        journey_date: today, departure_time: '08:00', arrival_time: '14:00',
        total_seats: 40, price_per_seat: 500, bus_type: 'SEATER',
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const cities = [
        'Mumbai', 'Pune', 'Bangalore', 'Chennai', 'Hyderabad',
        'Delhi', 'Jaipur', 'Ahmedabad', 'Kolkata', 'Coimbatore',
        'Surat', 'Nagpur', 'Indore', 'Bhopal', 'Lucknow', 'Visakhapatnam',
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === 'total_seats' || name === 'price_per_seat' ? Number(value) : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
        try {
            const { data } = await api.post('/api/buses/', form);
            setSuccess(`✅ Bus "${data.bus_number}" (${data.source_city} → ${data.destination_city}) created successfully!`);
            setForm({ bus_number: '', operator_name: '', source_city: '', destination_city: '', journey_date: today, departure_time: '08:00', arrival_time: '14:00', total_seats: 40, price_per_seat: 500, bus_type: 'SEATER' });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create bus.');
        } finally { setLoading(false); }
    };

    const F = ({ label, children }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            <label style={{ fontSize: '.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.07em' }}>{label}</label>
            {children}
        </div>
    );

    return (
        <div className="page">
            <div style={{ background: 'linear-gradient(135deg, #0a0f1e, #12192e)', padding: '36px 0' }}>
                <div className="container">
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>← Back</button>
                    <h1 style={{ color: '#fff', fontSize: '1.7rem', fontWeight: 800 }}>⚙️ Create New Bus Trip</h1>
                    <p style={{ color: 'rgba(255,255,255,.5)', marginTop: 4 }}>Admin Panel — Add a new bus to the system</p>
                </div>
            </div>

            <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>
                <div className="card" style={{ padding: '32px' }}>
                    {success && <div className="alert alert-success">{success}</div>}
                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <F label="Bus Number *">
                                <input className="input-field" name="bus_number" value={form.bus_number} onChange={handleChange} placeholder="e.g. RX-009" required />
                            </F>
                            <F label="Operator Name *">
                                <input className="input-field" name="operator_name" value={form.operator_name} onChange={handleChange} placeholder="e.g. VRL Travels" required />
                            </F>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <F label="Source City *">
                                <select className="input-field" name="source_city" value={form.source_city} onChange={handleChange} required>
                                    <option value="">Select city</option>
                                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </F>
                            <F label="Destination City *">
                                <select className="input-field" name="destination_city" value={form.destination_city} onChange={handleChange} required>
                                    <option value="">Select city</option>
                                    {cities.filter(c => c !== form.source_city).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </F>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                            <F label="Journey Date *">
                                <input className="input-field" type="date" name="journey_date" value={form.journey_date} min={today} onChange={handleChange} required />
                            </F>
                            <F label="Departure *">
                                <input className="input-field" type="time" name="departure_time" value={form.departure_time} onChange={handleChange} required />
                            </F>
                            <F label="Arrival *">
                                <input className="input-field" type="time" name="arrival_time" value={form.arrival_time} onChange={handleChange} required />
                            </F>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                            <F label="Total Seats *">
                                <input className="input-field" type="number" name="total_seats" value={form.total_seats} onChange={handleChange} min={1} max={100} required />
                            </F>
                            <F label="Price / Seat (₹) *">
                                <input className="input-field" type="number" name="price_per_seat" value={form.price_per_seat} onChange={handleChange} min={1} step="1" required />
                            </F>
                            <F label="Bus Type *">
                                <select className="input-field" name="bus_type" value={form.bus_type} onChange={handleChange} required>
                                    <option value="SEATER">💺 Non-AC Seater</option>
                                    <option value="AC_SEATER">🌬️ AC Seater</option>
                                    <option value="SLEEPER">🛏️ Non-AC Sleeper</option>
                                    <option value="AC_SLEEPER">❄️ AC Sleeper</option>
                                </select>
                            </F>
                        </div>

                        {form.source_city && form.destination_city && (
                            <div style={{ background: '#f8f9fb', borderRadius: 8, padding: '14px 16px', border: '1px solid #e4e7ed', marginBottom: 20, fontSize: '.88rem' }}>
                                <strong>Preview:</strong> {form.source_city} → {form.destination_city} | {form.departure_time}–{form.arrival_time} | {form.total_seats} seats | ₹{form.price_per_seat} | {form.bus_type?.replace('_', ' ')}
                            </div>
                        )}

                        <button
                            id="admin-submit" type="submit"
                            className="btn btn-red btn-full"
                            style={{ padding: '15px', borderRadius: 8, fontSize: '1rem' }}
                            disabled={loading}
                        >
                            {loading ? '⏳ Creating...' : '✅ Create Bus Trip'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateBusPage;
