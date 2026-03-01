import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminCreateBusPage from './pages/AdminCreateBusPage';

// Pages that use full-screen layouts (no shared navbar)
const NO_NAVBAR_PATHS = ['/', '/login', '/register'];

// Protected Route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    if (adminOnly) {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (!user?.is_admin) return <Navigate to="/search" replace />;
    }
    return children;
};

function AppContent() {
    const location = useLocation();
    const showNavbar = !NO_NAVBAR_PATHS.includes(location.pathname);

    return (
        <>
            {showNavbar && <Navbar />}
            <Routes>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/results" element={<ResultsPage />} />

                {/* Auth-protected */}
                <Route path="/seats/:busId" element={
                    <ProtectedRoute><SeatSelectionPage /></ProtectedRoute>
                } />
                <Route path="/payment" element={
                    <ProtectedRoute><PaymentPage /></ProtectedRoute>
                } />
                <Route path="/confirmation" element={
                    <ProtectedRoute><ConfirmationPage /></ProtectedRoute>
                } />
                <Route path="/my-bookings" element={
                    <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
                } />

                {/* Admin only */}
                <Route path="/admin/create-bus" element={
                    <ProtectedRoute adminOnly><AdminCreateBusPage /></ProtectedRoute>
                } />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
