import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plane, Calendar, MapPin, X, CheckCircle, LogIn, AlertCircle, Loader2, ArrowLeft, Home } from 'lucide-react';
import { getMyTrips, cancelBooking, getToken } from '../utils/api.js';

export function MyTripsPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);

    const isLoggedIn = !!getToken();

    useEffect(() => {
        async function fetchTrips() {
            if (!isLoggedIn) { setLoading(false); return; }
            try {
                const data = await getMyTrips();
                setBookings(data.trips || []);
            } catch (err) {
                setError(err.message || 'Failed to load trips');
            } finally {
                setLoading(false);
            }
        }
        fetchTrips();
    }, [isLoggedIn]);

    const handleCancel = async (bookingId) => {
        if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

        setCancellingId(bookingId);
        try {
            await cancelBooking(bookingId);
            // Instant UI update — set status to cancelled
            setBookings(prev =>
                prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
            );
        } catch (err) {
            alert(err.message || 'Failed to cancel booking');
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return (
                    <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /><span>Confirmed</span>
                    </div>
                );
            case 'completed':
                return (
                    <div className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /><span>Completed</span>
                    </div>
                );
            case 'cancelled':
                return (
                    <div className="flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium">
                        <X className="w-4 h-4" /><span>Cancelled</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                        <span>{status}</span>
                    </div>
                );
        }
    };

    // Not logged in state
    if (!isLoggedIn) {
        return (
            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <LogIn className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h3>
                        <p className="text-gray-600 mb-6">Log in to view your bookings and manage your trips.</p>
                        <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-[#0033A0] to-[#0052CC] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium">Login / Sign Up</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-[#0033A0] hover:text-[#002d8f] mb-4 group transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <Home className="w-4 h-4" />
                        <span className="font-medium">Back to Home</span>
                    </button>
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">My Trips</h1>
                    <p className="text-gray-600">View and manage all your flight bookings</p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-12 h-12 border-4 border-[#0033A0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your trips...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="text-[#0033A0] hover:underline font-medium">Try Again</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                                <p className="text-gray-600 mb-6">Start planning your next trip!</p>
                                <button onClick={() => navigate('/')} className="bg-gradient-to-r from-[#0033A0] to-[#0052CC] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium">Search Flights</button>
                            </div>
                        ) : (
                            bookings.map((booking) => (
                                <div key={booking.id} className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${booking.status === 'cancelled' ? 'opacity-75' : ''}`}>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0033A0] to-[#0052CC] flex items-center justify-center text-white font-bold text-lg">{booking.airline.substring(0, 2).toUpperCase()}</div>
                                                <div>
                                                    <div className="text-lg font-semibold text-gray-900">{booking.airline}</div>
                                                    <div className="text-sm text-gray-600">{booking.flightNumber}</div>
                                                </div>
                                            </div>
                                            {getStatusBadge(booking.status)}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pb-6 border-b border-gray-200">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MapPin className="w-4 h-4 text-[#0033A0]" />
                                                    <span className="text-sm font-medium text-gray-600">Route</span>
                                                </div>
                                                <div className="text-lg font-semibold text-gray-900 mb-1">{booking.from} → {booking.to}</div>
                                                <div className="text-sm text-gray-600">{booking.departureTime} - {booking.arrivalTime}</div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="w-4 h-4 text-[#0033A0]" />
                                                    <span className="text-sm font-medium text-gray-600">Travel Date</span>
                                                </div>
                                                <div className="text-lg font-semibold text-gray-900">
                                                    {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-600 mb-2">PNR Number</div>
                                                <div className="text-lg font-semibold text-gray-900 mb-2">{booking.pnr}</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {booking.seats.map((seat) => (
                                                        <span key={seat} className="bg-[#E8F1FF] text-[#0033A0] px-3 py-1 rounded-lg text-sm font-medium">{seat}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div>
                                                <span className="text-sm text-gray-600">Total Fare: </span>
                                                <span className="text-xl font-bold text-[#0033A0]">₹{booking.price.toLocaleString()}</span>
                                            </div>
                                            <div className="flex gap-3">
                                                {booking.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleCancel(booking.id)}
                                                        disabled={cancellingId === booking.id}
                                                        className="flex items-center gap-2 px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {cancellingId === booking.id ? (
                                                            <><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm font-medium">Cancelling...</span></>
                                                        ) : (
                                                            <><X className="w-4 h-4" /><span className="text-sm font-medium">Cancel Booking</span></>
                                                        )}
                                                    </button>
                                                )}
                                                {(booking.status === 'completed' || booking.status === 'cancelled') && (
                                                    <button onClick={() => navigate('/')} className="px-4 py-2 bg-gradient-to-r from-[#0033A0] to-[#0052CC] text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium">Book Again</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div className="mt-8 bg-gradient-to-r from-[#E8F1FF] to-[#D1E7FF] rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                    <p className="text-gray-700 mb-4">Have questions about your booking? Our customer support team is here to help you 24/7.</p>
                    <button className="bg-[#0033A0] text-white px-6 py-2.5 rounded-lg hover:bg-[#002d8f] transition-colors font-medium">Contact Support</button>
                </div>
            </div>
        </div>
    );
}
