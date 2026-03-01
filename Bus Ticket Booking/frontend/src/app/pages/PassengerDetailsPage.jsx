import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { User, Mail, Phone, Globe, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function PassengerDetailsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { flight: stateFlight, searchData } = location.state || {};

    const mockFlight = {
        id: '1', airline: 'IndiGo', flightNumber: '6E-2043', departure: 'Chennai',
        arrival: 'Delhi', departureTime: '06:30', arrivalTime: '09:15',
        duration: '2h 45m', stops: 0, price: 4299,
    };

    const flight = stateFlight || mockFlight;

    const [passengerData, setPassengerData] = useState({
        firstName: '', lastName: '', age: '', gender: '',
        passport: '', email: '', phone: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/seat-selection', { state: { flight, searchData, passengerData } });
    };

    if (!flight) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Flight not found</p>
                    <button onClick={() => navigate('/search')} className="text-[#0033A0] hover:underline font-medium">Go back to search</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress Indicator */}
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
                    <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium shadow-lg">✓</div>
                            <span className="text-sm text-gray-600">Flight</span>
                        </motion.div>
                        <div className="w-8 md:w-16 h-0.5 bg-[#0033A0]"></div>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0033A0] to-[#0052CC] text-white flex items-center justify-center text-sm font-bold shadow-lg">2</div>
                            <span className="text-sm font-medium text-gray-900">Details</span>
                        </motion.div>
                        <div className="w-8 md:w-16 h-0.5 bg-gray-300"></div>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">3</div>
                            <span className="text-sm text-gray-600">Seats</span>
                        </motion.div>
                        <div className="w-8 md:w-16 h-0.5 bg-gray-300"></div>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">4</div>
                            <span className="text-sm text-gray-600">Payment</span>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                            <motion.button whileHover={{ x: -5 }} onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-[#0033A0] mb-6 transition-colors">
                                <ArrowLeft className="w-5 h-5" /><span>Back</span>
                            </motion.button>

                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Passenger Information</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                        <input type="text" value={passengerData.firstName} onChange={(e) => setPassengerData({ ...passengerData, firstName: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent transition-all hover:border-[#0033A0]" placeholder="John" required />
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                        <input type="text" value={passengerData.lastName} onChange={(e) => setPassengerData({ ...passengerData, lastName: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent transition-all hover:border-[#0033A0]" placeholder="Doe" required />
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                                        <input type="number" value={passengerData.age} onChange={(e) => setPassengerData({ ...passengerData, age: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent transition-all hover:border-[#0033A0]" placeholder="25" min="1" max="120" required />
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                                        <select value={passengerData.gender} onChange={(e) => setPassengerData({ ...passengerData, gender: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent transition-all hover:border-[#0033A0]" required>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </motion.div>
                                </div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number (International Flights)</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0033A0]" />
                                        <input type="text" value={passengerData.passport} onChange={(e) => setPassengerData({ ...passengerData, passport: e.target.value })} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent transition-all hover:border-[#0033A0]" placeholder="A12345678" />
                                    </div>
                                </motion.div>

                                <div className="pt-6 border-t-2 border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
                                    <div className="space-y-6">
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0033A0]" />
                                                <input type="email" value={passengerData.email} onChange={(e) => setPassengerData({ ...passengerData, email: e.target.value })} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent transition-all hover:border-[#0033A0]" placeholder="john@example.com" required />
                                            </div>
                                        </motion.div>
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0033A0]" />
                                                <input type="tel" value={passengerData.phone} onChange={(e) => setPassengerData({ ...passengerData, phone: e.target.value })} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent transition-all hover:border-[#0033A0]" placeholder="+91 98765 43210" required />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-gradient-to-r from-[#0033A0] to-[#0052CC] text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                                    Continue to Seat Selection
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-1">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-20">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Flight Summary</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Flight', value: flight.flightNumber },
                                    { label: 'Route', value: `${flight.departure} → ${flight.arrival}` },
                                    { label: 'Time', value: `${flight.departureTime} - ${flight.arrivalTime}` },
                                    { label: 'Duration', value: flight.duration },
                                ].map((item, index) => (
                                    <motion.div key={item.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.1 }}>
                                        <div className="text-sm text-gray-600">{item.label}</div>
                                        <div className="font-semibold text-gray-900">{item.value}</div>
                                    </motion.div>
                                ))}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="pt-4 border-t-2 border-gray-200">
                                    <div className="text-sm text-gray-600 mb-1">Total Fare</div>
                                    <div className="text-3xl font-bold text-[#0033A0]">₹{flight.price.toLocaleString()}</div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
