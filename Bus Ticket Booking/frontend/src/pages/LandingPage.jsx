import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
    const navigate = useNavigate();
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

    return (
        <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
            <Navbar />

            {/* ════════════ HERO — Full screen bus photo ════════════ */}
            <section
                style={{
                    minHeight: '100vh',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',

                    /* Bus photo background */
                    backgroundImage: 'url(/hero-bus.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* ── Dark overlays to match the screenshot mood ── */}
                {/* Top-to-bottom dark vignette */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,.72) 0%, rgba(0,0,0,.38) 40%, rgba(0,0,0,.55) 70%, rgba(0,0,0,.82) 100%)',
                    zIndex: 1,
                }} />
                {/* Left side stronger dark (matches screenshot) */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to right, rgba(0,0,0,.6) 0%, rgba(0,0,0,.1) 60%, transparent 100%)',
                    zIndex: 1,
                }} />
                {/* Red tint overlay (subtle, matches brand) */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at center, rgba(180,10,30,.15) 0%, transparent 70%)',
                    zIndex: 1,
                }} />

                {/* ── Centre Content ── */}
                <div style={{
                    position: 'relative', zIndex: 2,
                    textAlign: 'center',
                    padding: '0 24px',
                    maxWidth: 720,
                    animation: 'heroIn .8s ease both',
                }}>
                    <style>{`
            @keyframes heroIn {
              from { opacity:0; transform:translateY(24px); }
              to   { opacity:1; transform:translateY(0); }
            }
            @keyframes heroIn2 {
              from { opacity:0; transform:translateY(20px); }
              to   { opacity:1; transform:translateY(0); }
            }
          `}</style>

                    {/* Pill badge — exactly like screenshot */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        background: 'rgba(200,20,40,.85)',
                        borderRadius: 999,
                        padding: '6px 20px',
                        marginBottom: 28,
                        backdropFilter: 'blur(8px)',
                        animation: 'heroIn .6s ease .1s both',
                    }}>
                        <span style={{ fontSize: '.72rem', color: '#fff', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                            Smart Ticket Booking System
                        </span>
                    </div>

                    {/* Main headline */}
                    <h1 style={{
                        fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
                        fontWeight: 900,
                        lineHeight: 1.1,
                        letterSpacing: '-.04em',
                        marginBottom: 16,
                        animation: 'heroIn .65s ease .15s both',
                    }}>
                        <span style={{ color: '#ffffff', display: 'block' }}>Ride Comfortably.</span>
                        <span style={{ color: '#e8192c', display: 'block' }}>Book with Ease.</span>
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        color: 'rgba(255,255,255,.75)',
                        fontSize: '1.05rem',
                        maxWidth: 480,
                        lineHeight: 1.75,
                        margin: '0 auto 40px',
                        fontStyle: 'italic',
                        animation: 'heroIn .65s ease .28s both',
                    }}>
                        The fastest and most reliable way to book your intercity bus
                        tickets online. Premium experience from start to destination.
                    </p>

                    {/* CTAs */}
                    <div style={{
                        display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap',
                        animation: 'heroIn .65s ease .38s both',
                    }}>
                        <button
                            id="hero-find-bus"
                            onClick={() => navigate('/search')}
                            style={{
                                padding: '15px 40px', borderRadius: 8,
                                background: '#e8192c', color: '#fff',
                                border: 'none', fontWeight: 700, fontSize: '1.02rem',
                                cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                                boxShadow: '0 6px 24px rgba(232,25,44,.55)',
                                transition: 'all .18s',
                                letterSpacing: '.01em',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#c01020'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(232,25,44,.65)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#e8192c'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(232,25,44,.55)'; }}
                        >
                            Find Your Bus
                        </button>

                        <button
                            id="hero-sign-in"
                            onClick={() => navigate('/login')}
                            style={{
                                padding: '15px 40px', borderRadius: 8,
                                background: 'rgba(255,255,255,.12)', color: '#fff',
                                border: '1.5px solid rgba(255,255,255,.4)',
                                fontWeight: 600, fontSize: '1.02rem',
                                cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                                backdropFilter: 'blur(8px)',
                                transition: 'all .18s', letterSpacing: '.01em',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.22)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.7)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.4)'; }}
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Stats row — bottom of hero */}
                    <div style={{
                        display: 'flex', gap: 40, justifyContent: 'center',
                        marginTop: 80, flexWrap: 'wrap',
                        animation: 'heroIn .65s ease .5s both',
                    }}>
                        {[
                            { v: '500+', l: 'Routes' },
                            { v: '50K+', l: 'Happy Travellers' },
                            { v: '4.9★', l: 'App Rating' },
                            { v: '24/7', l: 'Support' },
                        ].map(({ v, l }) => (
                            <div key={l} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-.02em' }}>{v}</div>
                                <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.5)', marginTop: 3, letterSpacing: '.05em' }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════ BELOW HERO SECTIONS ════════ */}

            {/* Bus Types */}
            <section style={{ background: '#0a0f1e', padding: '70px 48px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, textAlign: 'center', marginBottom: 10 }}>
                        All Bus Types Available
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,.45)', textAlign: 'center', marginBottom: 48 }}>
                        Pick the comfort that fits your journey
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
                        {[
                            { icon: '🌬️', type: 'AC Seater', color: '#818cf8', desc: 'Air-conditioned seats for short to medium trips' },
                            { icon: '💺', type: 'Non-AC Seater', color: '#fbbf24', desc: 'Affordable seating, great for day journeys' },
                            { icon: '❄️', type: 'AC Sleeper', color: '#2dd4bf', desc: 'Fully air-conditioned berths for overnight travel' },
                            { icon: '🛏️', type: 'Non-AC Sleeper', color: '#f87171', desc: 'Comfortable berths at the best prices' },
                        ].map(b => (
                            <div key={b.type} style={{
                                background: 'rgba(255,255,255,.05)',
                                border: '1px solid rgba(255,255,255,.08)',
                                borderRadius: 16, padding: '28px 20px', textAlign: 'center',
                                transition: 'all .2s', cursor: 'pointer',
                            }}
                                onClick={() => navigate('/search')}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.transform = ''; }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: 14 }}>{b.icon}</div>
                                <div style={{ color: b.color, fontWeight: 800, marginBottom: 8 }}>{b.type}</div>
                                <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '.82rem', lineHeight: 1.6 }}>{b.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Routes */}
            <section style={{ background: '#060d1a', padding: '70px 48px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, textAlign: 'center', marginBottom: 10 }}>Popular Routes</h2>
                    <p style={{ color: 'rgba(255,255,255,.45)', textAlign: 'center', marginBottom: 48 }}>Most booked this week — click to search instantly</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                        {[
                            { from: 'Mumbai', to: 'Pune', price: '₹299', time: '3.5h' },
                            { from: 'Bangalore', to: 'Chennai', price: '₹550', time: '6h' },
                            { from: 'Delhi', to: 'Jaipur', price: '₹400', time: '5h' },
                            { from: 'Hyderabad', to: 'Bangalore', price: '₹699', time: '9h' },
                            { from: 'Ahmedabad', to: 'Mumbai', price: '₹600', time: '8h' },
                            { from: 'Chennai', to: 'Coimbatore', price: '₹350', time: '4h' },
                        ].map(r => (
                            <div key={r.from + r.to}
                                onClick={() => navigate(`/results?source_city=${r.from}&destination_city=${r.to}&journey_date=${new Date(Date.now() + 86400000).toISOString().split('T')[0]}`)}
                                style={{
                                    background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)',
                                    borderRadius: 12, padding: '18px 22px', cursor: 'pointer',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    transition: 'all .18s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,25,44,.12)'; e.currentTarget.style.borderColor = 'rgba(232,25,44,.35)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)'; e.currentTarget.style.transform = ''; }}
                            >
                                <div>
                                    <div style={{ color: '#fff', fontWeight: 700 }}>{r.from} → {r.to}</div>
                                    <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.78rem', marginTop: 3 }}>⏱ {r.time}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#e8192c', fontWeight: 900, fontSize: '1.1rem' }}>{r.price}</div>
                                    <div style={{ color: 'rgba(255,255,255,.35)', fontSize: '.7rem' }}>onwards</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{
                background: 'linear-gradient(135deg, #b91c1c, #7f1d1d)',
                padding: '72px 48px', textAlign: 'center',
            }}>
                <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: 14 }}>
                    Ready to hit the road?
                </h2>
                <p style={{ color: 'rgba(255,255,255,.7)', marginBottom: 32, fontSize: '1rem' }}>
                    Join 50,000+ satisfied travellers. Book your bus in under 60 seconds.
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        className="btn btn-white btn-xl"
                        onClick={() => navigate('/search')}
                    >
                        Search Buses Now
                    </button>
                    {!user && (
                        <button
                            className="btn btn-ghost btn-xl"
                            onClick={() => navigate('/register')}
                            style={{ border: '1.5px solid rgba(255,255,255,.4)' }}
                        >
                            Create Free Account
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
