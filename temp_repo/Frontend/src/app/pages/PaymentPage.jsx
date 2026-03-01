import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { CreditCard, Smartphone, Building2, Lock, CheckCircle } from 'lucide-react';
import { createBooking } from '../utils/api.js';

export function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        flight, searchData, passengerData: statePassengerData,
        selectedSeats = [],
    } = location.state || {};
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [bookingPnr, setBookingPnr] = useState('');
    const [paymentError, setPaymentError] = useState(null);

    const [cardData, setCardData] = useState({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');

    const mockPassengerData = { firstName: 'John', lastName: 'Doe', gender: 'Male', age: 30, email: 'john.doe@example.com', phone: '+91 9876543210' };
    const passengerData = statePassengerData || mockPassengerData;

    // Auto-redirect after animation
    useEffect(() => {
        if (bookingConfirmed) {
            const timer = setTimeout(() => navigate('/my-trips'), 3500);
            return () => clearTimeout(timer);
        }
    }, [bookingConfirmed, navigate]);



    if (!flight || !flight.price) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Invalid booking data</p>
                    <button onClick={() => navigate('/search')} className="text-[#0033A0] hover:underline font-medium">Go back to search</button>
                </div>
            </div>
        );
    }

    const seatCount = selectedSeats.length;
    const totalAmount = flight.price + seatCount * 200;

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setPaymentError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const result = await createBooking(
                Number(flight.id),
                selectedSeats,
                totalAmount,
                passengerData,
            );

            setBookingPnr(result.pnr);
            setBookingConfirmed(true);
        } catch (err) {
            setPaymentError(err.message || 'Booking failed. Please try again.');
            setIsProcessing(false);
        }
    };

    // ── Booking Confirmed Overlay ───────────────────────────────────
    if (bookingConfirmed) {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-[#0033A0] to-[#0052CC]">
                {/* Confetti particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className="confetti-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 1}s`,
                                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][i % 8],
                            }}
                        />
                    ))}
                </div>

                <div className="text-center relative z-10" style={{ animation: 'scaleIn 0.5s ease-out' }}>
                    {/* Animated checkmark */}
                    <div className="mx-auto mb-8" style={{ width: 120, height: 120 }}>
                        <svg viewBox="0 0 120 120" className="checkmark-svg">
                            <circle
                                cx="60" cy="60" r="54"
                                fill="none"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="4"
                            />
                            <circle
                                cx="60" cy="60" r="54"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                                strokeLinecap="round"
                                className="checkmark-circle"
                            />
                            <polyline
                                points="38,62 52,76 82,46"
                                fill="none"
                                stroke="white"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="checkmark-check"
                            />
                        </svg>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-3" style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
                        Booking Confirmed!
                    </h1>
                    <p className="text-xl text-white/90 mb-2" style={{ animation: 'fadeInUp 0.6s ease-out 0.6s both' }}>
                        Your PNR: <span className="font-bold text-[#FFD700]">{bookingPnr}</span>
                    </p>
                    <p className="text-white/70 mb-2" style={{ animation: 'fadeInUp 0.6s ease-out 0.8s both' }}>
                        {flight.departure} → {flight.arrival} • {selectedSeats.join(', ')}
                    </p>
                    <p className="text-white/60 text-sm mb-6" style={{ animation: 'fadeInUp 0.6s ease-out 0.9s both' }}>
                        📧 Confirmation email sent to {passengerData.email}
                    </p>
                    <div className="text-white/60 text-sm" style={{ animation: 'fadeInUp 0.6s ease-out 1s both' }}>
                        <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
                        Redirecting to My Trips...
                    </div>
                </div>

                <style>{`
                    @keyframes scaleIn {
                        from { opacity: 0; transform: scale(0.8); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .checkmark-circle {
                        stroke-dasharray: 340;
                        stroke-dashoffset: 340;
                        animation: drawCircle 0.8s ease-out 0.2s forwards;
                    }
                    @keyframes drawCircle {
                        to { stroke-dashoffset: 0; }
                    }
                    .checkmark-check {
                        stroke-dasharray: 80;
                        stroke-dashoffset: 80;
                        animation: drawCheck 0.5s ease-out 0.8s forwards;
                    }
                    @keyframes drawCheck {
                        to { stroke-dashoffset: 0; }
                    }
                    .confetti-particle {
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        border-radius: 2px;
                        top: -10px;
                        animation: confettiFall 3s ease-in-out infinite;
                    }
                    @keyframes confettiFall {
                        0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
                        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Lock className="w-5 h-5 text-green-600" />
                                <h2 className="text-2xl font-semibold text-gray-900">Secure Payment</h2>
                            </div>

                            <div className="flex gap-2 mb-6 border-b border-gray-200">
                                <button onClick={() => setPaymentMethod('card')} className={`px-6 py-3 border-b-2 transition-colors ${paymentMethod === 'card' ? 'border-[#0033A0] text-[#0033A0] font-medium' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                                    <div className="flex items-center gap-2"><CreditCard className="w-5 h-5" /><span>Card</span></div>
                                </button>
                                <button onClick={() => setPaymentMethod('upi')} className={`px-6 py-3 border-b-2 transition-colors ${paymentMethod === 'upi' ? 'border-[#0033A0] text-[#0033A0] font-medium' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                                    <div className="flex items-center gap-2"><Smartphone className="w-5 h-5" /><span>UPI</span></div>
                                </button>
                                <button onClick={() => setPaymentMethod('netbanking')} className={`px-6 py-3 border-b-2 transition-colors ${paymentMethod === 'netbanking' ? 'border-[#0033A0] text-[#0033A0] font-medium' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                                    <div className="flex items-center gap-2"><Building2 className="w-5 h-5" /><span>Net Banking</span></div>
                                </button>
                            </div>

                            <form onSubmit={handlePayment}>
                                {paymentMethod === 'card' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                                            <input type="text" value={cardData.cardNumber} onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent" placeholder="1234 5678 9012 3456" maxLength={19} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                                            <input type="text" value={cardData.cardName} onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent" placeholder="JOHN DOE" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                                                <input type="text" value={cardData.expiryDate} onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent" placeholder="MM/YY" maxLength={5} required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                                                <input type="password" value={cardData.cvv} onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent" placeholder="123" maxLength={3} required />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'upi' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID *</label>
                                        <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent" placeholder="yourname@upi" required />
                                        <p className="mt-2 text-sm text-gray-600">Enter your UPI ID to complete the payment</p>
                                    </div>
                                )}

                                {paymentMethod === 'netbanking' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Bank *</label>
                                        <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent" required>
                                            <option value="">Choose Bank</option>
                                            <option value="sbi">State Bank of India</option>
                                            <option value="hdfc">HDFC Bank</option>
                                            <option value="icici">ICICI Bank</option>
                                            <option value="axis">Axis Bank</option>
                                            <option value="kotak">Kotak Mahindra Bank</option>
                                        </select>
                                    </div>
                                )}

                                {paymentError && (
                                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-700 font-medium">{paymentError}</p>
                                    </div>
                                )}

                                <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-start gap-3">
                                    <Lock className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium text-green-900">SSL Secure Payment</p>
                                        <p className="text-green-700">Your payment information is encrypted and secure</p>
                                    </div>
                                </div>

                                <button type="submit" disabled={isProcessing} className="w-full mt-6 bg-gradient-to-r from-[#0033A0] to-[#0052CC] text-white py-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium">
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Processing Payment...</span>
                                        </>
                                    ) : (
                                        <span>Pay ₹{totalAmount.toLocaleString()}</span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-20">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Flight Details</div>
                                    <div className="font-medium text-gray-900">{flight.flightNumber}</div>
                                    <div className="text-sm text-gray-700">{flight.airline}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Route</div>
                                    <div className="font-medium text-gray-900">{flight.departure} → {flight.arrival}</div>
                                    <div className="text-sm text-gray-700">{flight.departureTime} - {flight.arrivalTime}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Passenger</div>
                                    <div className="font-medium text-gray-900">{passengerData.firstName} {passengerData.lastName}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Seats</div>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedSeats.map((seat) => (
                                            <span key={seat} className="bg-[#0033A0] text-white px-2 py-1 rounded text-xs">{seat}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-sm"><span className="text-gray-600">Base Fare</span><span className="font-medium text-gray-900">₹{(flight.price * 0.75).toFixed(0)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-600">Taxes & Fees</span><span className="font-medium text-gray-900">₹{(flight.price * 0.25).toFixed(0)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-600">Seat Charges ({seatCount} seat{seatCount > 1 ? 's' : ''})</span><span className="font-medium text-gray-900">₹{(seatCount * 200).toLocaleString()}</span></div>
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-semibold text-[#0033A0]">₹{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
