import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone_number: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            const { data } = await api.post('/api/auth/register', {
                name: form.name, email: form.email,
                phone_number: form.phone_number, password: form.password,
            });
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/search');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* LEFT PANEL */}
            <div style={{
                flex: '0 0 48%', maxWidth: '48%',
                background: 'linear-gradient(160deg, #1a2540 0%, #0d1525 40%, #1a0810 80%, #0a0f1e 100%)',
                position: 'relative', display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-end', padding: '48px', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: '25%', left: '15%',
                    width: 300, height: 300, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(232,25,44,.2) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)
          `,
                    backgroundSize: '80px 80px', pointerEvents: 'none',
                }} />
                {/* Logo */}
                <div style={{ position: 'absolute', top: 32, left: 40, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: '#e8192c', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🚌</div>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>RouteXen</span>
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-.03em' }}>
                        Start Your<br />Journey Today
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '1rem', lineHeight: 1.7 }}>
                        Join thousands of travellers who trust RouteXen for their intercity journeys.
                    </p>
                    <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {['Book in under 60 seconds', 'Cancel anytime hassle-free', 'Best prices guaranteed'].map((f) => (
                            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(232,25,44,.3)', border: '1px solid rgba(232,25,44,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem', color: '#fca5a5', flexShrink: 0 }}>✓</div>
                                <span style={{ color: 'rgba(255,255,255,.65)', fontSize: '.9rem' }}>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: '48px 64px',
                background: '#fff', position: 'relative',
            }}>
                <div style={{ position: 'absolute', top: 32, right: 40 }}>
                    <Link to="/login"><button className="btn btn-outline-red btn-sm">Sign In</button></Link>
                </div>

                <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0a0f1e', marginBottom: 6, letterSpacing: '-.03em' }}>Create Account</h1>
                    <p style={{ color: '#64748b', marginBottom: 28 }}>Get started — it's free and takes 30 seconds</p>

                    {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-wrap" style={{ marginBottom: 16 }}>
                            <label className="input-label">Full Name</label>
                            <input id="reg-name" className="input-field" type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="input-wrap" style={{ marginBottom: 16 }}>
                            <label className="input-label">Email Address</label>
                            <input id="reg-email" className="input-field" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="input-wrap" style={{ marginBottom: 16 }}>
                            <label className="input-label">Phone Number</label>
                            <input id="reg-phone" className="input-field" type="tel" name="phone_number" placeholder="9876543210" value={form.phone_number} onChange={handleChange} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="input-wrap" style={{ marginBottom: 24 }}>
                                <label className="input-label">Password</label>
                                <input id="reg-password" className="input-field" type="password" name="password" placeholder="Min 6 chars" value={form.password} onChange={handleChange} required />
                            </div>
                            <div className="input-wrap" style={{ marginBottom: 24 }}>
                                <label className="input-label">Confirm</label>
                                <input id="reg-confirm" className="input-field" type="password" name="confirm" placeholder="Re-enter" value={form.confirm} onChange={handleChange} required />
                            </div>
                        </div>

                        <button
                            id="reg-submit" type="submit"
                            className="btn btn-red btn-full"
                            style={{ padding: '15px', fontSize: '1rem', borderRadius: 8 }}
                            disabled={loading}
                        >
                            {loading ? '🔄 Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 20, color: '#64748b', fontSize: '.9rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#e8192c', fontWeight: 700 }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
