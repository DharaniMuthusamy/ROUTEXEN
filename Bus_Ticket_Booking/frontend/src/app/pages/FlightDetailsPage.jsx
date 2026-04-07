import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Plane, Briefcase, Clock, Calendar, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback.jsx';
import { motion } from 'motion/react';
import { getFlightById, apiFlightToFrontend } from '../../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { LoginModal } from '../components/LoginModal.jsx';

export function FlightDetailsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const { flight: stateFlight, searchData } = location.state || {};
    const { user } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [flight, setFlight] = useState(stateFlight || null);
    const [loading, setLoading] = useState(!stateFlight);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!stateFlight && params.id) {
            setLoading(true);
            getFlightById(params.id)
                .then(apiFlight => {
                    setFlight(apiFlightToFrontend(apiFlight));
                })
                .catch(err => {
                    setError(err.message || 'Flight not found');
                })
                .finally(() => setLoading(false));
        }
    }, [params.id, stateFlight]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#0033A0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading flight details...</p>
                </div>
            </div>
        );
    }

    if (error || !flight || !flight.price) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">{error || 'Flight not found'}</p>
                    <button onClick={() => navigate('/search')} className="text-[#0033A0] hover:underline font-medium">Go back to search</button>
                </div>
            </div>
        );
    }

    const priceBreakdown = [
        { label: 'Base Fare', amount: flight.price * 0.75 },
        { label: 'Taxes & Fees', amount: flight.price * 0.2 },
        { label: 'Convenience Fee', amount: flight.price * 0.05 },
    ];

    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                <div className="relative h-80 bg-gradient-to-r from-[#0033A0] to-[#0052CC] overflow-hidden">
                    <motion.div initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 0.4 }} transition={{ duration: 1 }} className="absolute inset-0">
                        <ImageWithFallback
                            src="https://images.unsplash.com/photo-1759173342374-f7702ead3a02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhaXJwbGFuZSUyMGludGVyaW9yJTIwY2FiaW58ZW58MXx8fHwxNzcxODMzMTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Flight" className="w-full h-full object-cover"
                        />
                    </motion.div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
                        <motion.button initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} whileHover={{ x: -5 }} onClick={() => navigate(-1)} className="flex items-center gap-2 text-white mb-6 hover:text-white/80 transition-colors w-fit">
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to results</span>
                        </motion.button>
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-white">
                            <h1 className="text-5xl font-bold mb-3">{flight.airline}</h1>
                            <p className="text-2xl text-white/90">{flight.flightNumber}</p>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Flight Details</h2>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <div className="text-4xl font-bold text-gray-900 mb-1">{flight.departureTime}</div>
                                        <div className="text-lg text-gray-600">{flight.departure}</div>
                                    </div>
                                    <div className="flex-1 px-8">
                                        <div className="text-center text-sm text-gray-600 mb-2 font-medium">{flight.duration}</div>
                                        <div className="w-full border-t-2 border-dashed border-gray-300 relative">
                                            <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                                                <Plane className="w-6 h-6 text-[#0033A0] absolute -top-3 left-1/2 -translate-x-1/2 rotate-90" />
                                            </motion.div>
                                        </div>
                                        <div className="text-center text-sm mt-2">
                                            {flight.stops === 0 ? (<span className="text-green-600 font-semibold">Non-stop</span>) : (<span className="text-gray-600">{flight.stops} stop(s)</span>)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-bold text-gray-900 mb-1">{flight.arrivalTime}</div>
                                        <div className="text-lg text-gray-600">{flight.arrival}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                                    <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#0033A0] to-[#0052CC] rounded-lg flex items-center justify-center"><Plane className="w-6 h-6 text-white" /></div>
                                        <div><div className="text-sm text-gray-600">Aircraft Type</div><div className="font-semibold text-gray-900">Airbus A320</div></div>
                                    </motion.div>
                                    <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#0033A0] to-[#0052CC] rounded-lg flex items-center justify-center"><Briefcase className="w-6 h-6 text-white" /></div>
                                        <div><div className="text-sm text-gray-600">Baggage</div><div className="font-semibold text-gray-900">7 kg Cabin + 15 kg Check-in</div></div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Fare Rules</h2>
                                <div className="space-y-4">
                                    <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4 p-4 rounded-lg hover:bg-green-50 transition-colors">
                                        <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                                        <div><div className="font-semibold text-gray-900">Date Change Allowed</div><div className="text-sm text-gray-600">Change fee: ₹2,500 + fare difference</div></div>
                                    </motion.div>
                                    <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4 p-4 rounded-lg hover:bg-red-50 transition-colors">
                                        <XCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                                        <div><div className="font-semibold text-gray-900">Non-refundable</div><div className="text-sm text-gray-600">This fare is non-refundable</div></div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cancellation Policy</h2>
                                <div className="space-y-3">
                                    {[
                                        { time: '0-2 hours before departure', fee: 'No refund', color: 'text-red-600' },
                                        { time: '2-24 hours before departure', fee: 'Cancellation fee: ₹3,000', color: 'text-gray-900' },
                                        { time: 'More than 24 hours', fee: 'Cancellation fee: ₹2,000', color: 'text-gray-900' },
                                    ].map((policy, index) => (
                                        <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + index * 0.1 }} className="flex justify-between py-3 border-b border-gray-200 last:border-0">
                                            <span className="text-gray-600">{policy.time}</span>
                                            <span className={`font-semibold ${policy.color}`}>{policy.fee}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-1">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-20">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Price Breakdown</h2>
                                <div className="space-y-3 mb-6">
                                    {priceBreakdown.map((item, index) => (
                                        <motion.div key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.1 }} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{item.label}</span>
                                            <span className="font-medium text-gray-900">₹{item.amount.toFixed(0)}</span>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t-2 border-gray-300 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">Total Amount</span>
                                        <span className="text-3xl font-bold text-[#0033A0]">₹{flight.price.toLocaleString()}</span>
                                    </div>
                                </div>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { if (user) { navigate('/passenger-details', { state: { flight, searchData } }); } else { setShowLoginModal(true); } }} className="w-full bg-gradient-to-r from-[#0033A0] to-[#0052CC] text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">Continue to Book</motion.button>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <Clock className="w-5 h-5 text-[#0033A0] mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-gray-700"><p className="font-semibold mb-1">Quick Booking</p><p>Complete your booking in just 3 simple steps</p></div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSuccess={() => {
                    setShowLoginModal(false);
                    navigate('/passenger-details', { state: { flight, searchData } });
                }}
            />
        </>
    );
}
