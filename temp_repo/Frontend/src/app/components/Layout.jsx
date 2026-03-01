import { Outlet, useLocation } from 'react-router';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

export function Layout() {
    const location = useLocation();
    const isLanding = location.pathname === '/';

    return (
        <AuthProvider>
            <div className="min-h-screen flex flex-col">
                <Header />
                {/* Spacer for fixed header — landing page hero handles its own padding */}
                {!isLanding && <div className="h-16" />}
                <main className="flex-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </AuthProvider>
    );
}
