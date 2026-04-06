import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Plane, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    const isLanding = location.pathname === '/';

    // Listen to scroll to toggle between transparent and solid navbar
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // On landing page + not scrolled = transparent mode
    const isTransparent = isLanding && !scrolled;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent
                    ? 'bg-transparent'
                    : 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                        <div className={`rounded-xl p-2 transition-colors duration-300 ${isTransparent ? 'bg-white/15 backdrop-blur-md' : 'bg-[#0033A0]'
                            }`}>
                            <Plane className="w-5 h-5 text-white" />
                        </div>
                        <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${isTransparent ? 'text-white' : 'text-[#0033A0]'
                            }`}>
                            SkyBook
                        </span>
                    </Link>

                    <nav className="flex items-center gap-5">
                        <Link
                            to="/my-trips"
                            className={`font-medium text-sm transition-colors duration-300 ${isTransparent
                                    ? 'text-white/80 hover:text-white'
                                    : 'text-gray-700 hover:text-[#0033A0]'
                                }`}
                        >
                            My Trips
                        </Link>

                        {loading ? (
                            <div className={`w-24 h-9 rounded-xl animate-pulse ${isTransparent ? 'bg-white/10' : 'bg-gray-100'
                                }`} />
                        ) : user ? (
                            <div className="flex items-center gap-2.5">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors duration-300 ${isTransparent ? 'bg-white/10 backdrop-blur-md' : 'bg-[#0033A0]/5'
                                    }`}>
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isTransparent ? 'bg-white/20 text-white' : 'bg-[#0033A0] text-white'
                                        }`}>
                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <span className={`text-sm font-medium hidden sm:inline transition-colors duration-300 ${isTransparent ? 'text-white/90' : 'text-gray-800'
                                        }`}>
                                        {user.name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className={`flex items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 ${isTransparent
                                            ? 'text-white/60 hover:text-red-300 hover:bg-white/10'
                                            : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                                        }`}
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${isTransparent
                                        ? 'bg-white/15 backdrop-blur-md text-white border border-white/20 hover:bg-white/25'
                                        : 'bg-[#0033A0] text-white hover:bg-[#002d8f]'
                                    }`}
                            >
                                <User className="w-3.5 h-3.5" />
                                <span>Login / Signup</span>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
