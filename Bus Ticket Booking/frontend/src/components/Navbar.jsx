import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isMock = localStorage.getItem('token') === 'mock-jwt-demo-routexen';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const active = (path) => location.pathname === path ? 'active' : '';

    // Avatar letter from name
    const avatar = user ? user.name.charAt(0).toUpperCase() : '?';
    const firstName = user ? user.name.split(' ')[0] : '';

    return (
        <nav className="navbar">
            {/* Brand */}
            <div className="navbar-brand" onClick={() => navigate('/')}>
                <div className="navbar-logo">🚌</div>
                <span className="navbar-name">Route<span>Xen</span></span>
            </div>

            {/* Links */}
            <ul className="navbar-links">
                <li>
                    <button className={`nav-link ${active('/search')}`} onClick={() => navigate('/search')}>
                        Search Buses
                    </button>
                </li>

                {user ? (
                    <>
                        <li>
                            <button className={`nav-link ${active('/my-bookings')}`} onClick={() => navigate('/my-bookings')}>
                                My Bookings
                            </button>
                        </li>
                        {user.is_admin && (
                            <li>
                                <button className={`nav-link ${active('/admin/create-bus')}`} onClick={() => navigate('/admin/create-bus')}>
                                    + Add Bus
                                </button>
                            </li>
                        )}

                        {/* User chip — name on top right */}
                        <li>
                            <div className="user-chip" title={user.email}>
                                <div className="user-avatar">{avatar}</div>
                                <span className="user-name">
                                    {firstName}
                                    {isMock && <span style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.5)', marginLeft: 3 }}>(demo)</span>}
                                </span>
                            </div>
                        </li>

                        <li>
                            <button
                                id="navbar-logout"
                                className="btn btn-sm"
                                onClick={handleLogout}
                                style={{
                                    background: 'rgba(232,25,44,.15)', color: '#fca5a5',
                                    border: '1px solid rgba(232,25,44,.3)', borderRadius: 8,
                                }}
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <button className="nav-link" onClick={() => navigate('/login')}>Login</button>
                        </li>
                        <li>
                            <button
                                id="navbar-register"
                                className="btn btn-indigo btn-sm"
                                onClick={() => navigate('/register')}
                            >
                                Register
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
