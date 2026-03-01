import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { MOCK_USER, MOCK_TOKEN } from '../services/mockData';

const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleDemoLogin = () => {
        localStorage.setItem('token', MOCK_TOKEN);
        localStorage.setItem('user', JSON.stringify(MOCK_USER));
        navigate('/search');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const { data } = await api.post('/api/auth/login', form);
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/search');
        } catch (err) {
            if (err.isNetworkError || err.code === 'ERR_NETWORK' || !err.response) {
                setError('backend_offline');
            } else if (err.response?.status === 401 || err.response?.status === 400) {
                setError('Incorrect email or password. Please check your credentials.');
            } else {
                setError(err.response?.data?.detail || 'Login failed. Please try again.');
            }
        } finally { setLoading(false); }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* ── LEFT PANEL ── */}
            <div style={{
                flex: '0 0 48%', maxWidth: '48%',
                background: 'linear-gradient(160deg, #1a2540 0%, #0d1525 40%, #1a0810 80%, #0a0f1e 100%)',
                position: 'relative', display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-end', padding: '48px',
                overflow: 'hidden',
            }}>
                {/* Glow effect */}
                <div style={{
                    position: 'absolute', top: '30%', left: '20%',
                    width: 300, height: 300, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(232,25,44,.2) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                {/* Decorative lines */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)
          `,
                    backgroundSize: '80px 80px',
                    pointerEvents: 'none',
                }} />
                {/* Bus illustration lines (road) */}
                <div style={{
                    position: 'absolute', bottom: 100, left: 0, right: 0, height: 2,
                    background: 'rgba(255,255,255,.07)',
                }} />
                <div style={{
                    position: 'absolute', bottom: 80, left: 0, right: 0, height: 1,
                    backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,.1) 0px, rgba(255,255,255,.1) 40px, transparent 40px, transparent 70px)',
                }} />

                {/* Logo */}
                <div style={{ position: 'absolute', top: 32, left: 40, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, background: '#e8192c', borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                    }}>🚌</div>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>RouteXen</span>
                </div>

                {/* Text */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{
                        color: '#fff', fontSize: '2.2rem', fontWeight: 900,
                        lineHeight: 1.2, marginBottom: 16, letterSpacing: '-.03em',
                    }}>
                        Welcome Back to<br />RouteXen
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '1rem', lineHeight: 1.7 }}>
                        The premier professional bus ticketing experience.
                        Book your next journey with ease and comfort.
                    </p>

                    {/* Feature points */}
                    <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {['Real-time seat availability', 'Instant booking confirmation', 'Safe & secure payments'].map((f) => (
                            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 22, height: 22, borderRadius: '50%', background: 'rgba(232,25,44,.3)',
                                    border: '1px solid rgba(232,25,44,.5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '.7rem', color: '#fca5a5', flexShrink: 0,
                                }}>✓</div>
                                <span style={{ color: 'rgba(255,255,255,.65)', fontSize: '.9rem' }}>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: '48px 64px',
                background: '#fff', position: 'relative',
            }}>
                {/* Register link top right */}
                <div style={{ position: 'absolute', top: 32, right: 40 }}>
                    <Link to="/register">
                        <button className="btn btn-red btn-sm">Register</button>
                    </Link>
                </div>

                <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0a0f1e', marginBottom: 6, letterSpacing: '-.03em' }}>
                        Sign In
                    </h1>
                    <p style={{ color: '#64748b', marginBottom: 32 }}>Access your tickets and manage bookings</p>

                    {error === 'backend_offline' ? (
                        <div style={{
                            padding: '14px 16px', background: '#fff7ed',
                            border: '1px solid #fed7aa', borderRadius: 8,
                            marginBottom: 20, fontSize: '.85rem',
                        }}>
                            <div style={{ fontWeight: 700, color: '#c2410c', marginBottom: 6 }}>⚠️ Backend not reachable</div>
                            <div style={{ color: '#9a3412', lineHeight: 1.6 }}>The API server isn't running on port 8000.</div>
                            <button
                                onClick={handleDemoLogin}
                                style={{
                                    marginTop: 10, padding: '8px 16px', borderRadius: 6, border: 'none',
                                    background: '#c2410c', color: '#fff', fontWeight: 700,
                                    cursor: 'pointer', fontSize: '.82rem', fontFamily: 'inherit',
                                }}
                            >
                                🎭 Continue in Demo Mode
                            </button>
                        </div>
                    ) : error ? (
                        <div className="alert alert-error" style={{ marginBottom: 20 }}>
                            <span>⚠</span> {error}
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit}>
                        <div className="input-wrap" style={{ marginBottom: 18 }}>
                            <label className="input-label">Email Address</label>
                            <input
                                id="login-email"
                                className="input-field"
                                type="email" name="email"
                                placeholder="you@example.com"
                                value={form.email} onChange={handleChange} required
                            />
                        </div>

                        <div className="input-wrap" style={{ marginBottom: 28 }}>
                            <label className="input-label">Password</label>
                            <input
                                id="login-password"
                                className="input-field"
                                type="password" name="password"
                                placeholder="Enter your password"
                                value={form.password} onChange={handleChange} required
                            />
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            className="btn btn-red btn-full"
                            style={{ padding: '15px', fontSize: '1rem', borderRadius: 8 }}
                            disabled={loading}
                        >
                            {loading ? '🔄 Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 24, color: '#64748b', fontSize: '.9rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#e8192c', fontWeight: 700 }}>Create one now</Link>
                    </p>

                    <div style={{
                        marginTop: 24, padding: '12px 16px', background: '#f8f9fb',
                        borderRadius: 8, border: '1px solid #e4e7ed',
                        fontSize: '.78rem', color: '#64748b', lineHeight: 1.8,
                    }}>
                        <div style={{ fontWeight: 700, marginBottom: 3 }}>🔑 Demo Credentials (backend required)</div>
                        Admin: admin@routexen.com / admin123<br />
                        User: arjun@example.com / pass1234
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #e4e7ed' }}>
                            <button onClick={handleDemoLogin}
                                style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer', fontSize: '.78rem', fontFamily: 'inherit', padding: 0 }}>
                                🎭 Skip login — Try Demo Mode →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
