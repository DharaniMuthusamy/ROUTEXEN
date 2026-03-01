import { useLocation, useNavigate } from 'react-router';
import { CheckCircle, Download, Mail, Calendar, MapPin, User, CreditCard } from 'lucide-react';

export function BookingConfirmationPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingId, flight, searchData, passengerData, selectedSeats, totalAmount } = location.state || {};

    const mockData = {
        bookingId: 'PNR' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        flight: { flightNumber: '6E-2043', airline: 'IndiGo', departure: 'Chennai', arrival: 'Delhi', departureTime: '06:30', arrivalTime: '09:15', price: 4299 },
        passengerData: { firstName: 'John', lastName: 'Doe', gender: 'Male', age: 30, email: 'john.doe@example.com', phone: '+91 9876543210' },
        selectedSeats: ['12A'],
        totalAmount: 4499,
    };

    const finalBookingId = bookingId || mockData.bookingId;
    const finalFlight = flight || mockData.flight;
    const finalPassengerData = passengerData || mockData.passengerData;
    const finalSelectedSeats = selectedSeats || mockData.selectedSeats;
    const finalTotalAmount = totalAmount || mockData.totalAmount;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h1>
                    <p className="text-lg text-gray-600">Your flight has been successfully booked</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-[#0033A0] to-[#0052CC] px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-white/80">Booking Reference</div>
                                <div className="text-2xl font-semibold text-white">{finalBookingId}</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                <div className="text-xs text-white/80">Status</div>
                                <div className="text-sm font-semibold text-white">CONFIRMED</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-[#0033A0] mt-0.5" />
                                    <div>
                                        <div className="text-sm text-gray-600">Flight Number</div>
                                        <div className="font-medium text-gray-900">{finalFlight.flightNumber}</div>
                                        <div className="text-sm text-gray-700">{finalFlight.airline}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-[#0033A0] mt-0.5" />
                                    <div>
                                        <div className="text-sm text-gray-600">Route</div>
                                        <div className="font-medium text-gray-900">{finalFlight.departure} → {finalFlight.arrival}</div>
                                        <div className="text-sm text-gray-700">{finalFlight.departureTime} - {finalFlight.arrivalTime}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Passenger Details</h3>
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-[#0033A0] mt-0.5" />
                                <div>
                                    <div className="font-medium text-gray-900">{finalPassengerData.firstName} {finalPassengerData.lastName}</div>
                                    <div className="text-sm text-gray-700">{finalPassengerData.gender} • {finalPassengerData.age} years</div>
                                    <div className="text-sm text-gray-600 mt-1">{finalPassengerData.email}</div>
                                    <div className="text-sm text-gray-600">{finalPassengerData.phone}</div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seat Assignment</h3>
                            <div className="flex flex-wrap gap-2">
                                {finalSelectedSeats.map((seat) => (
                                    <div key={seat} className="bg-[#0033A0] text-white px-4 py-2 rounded-lg font-medium">Seat {seat}</div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm"><span className="text-gray-600">Base Fare</span><span className="font-medium text-gray-900">₹{(finalFlight.price * 0.75).toFixed(0)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-600">Taxes & Fees</span><span className="font-medium text-gray-900">₹{(finalFlight.price * 0.25).toFixed(0)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-600">Seat Charges</span><span className="font-medium text-gray-900">₹{(finalSelectedSeats.length * 200).toLocaleString()}</span></div>
                            </div>
                            <div className="pt-4 border-t-2 border-gray-300">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900">Total Paid</span>
                                    <span className="text-2xl font-semibold text-[#0033A0]">₹{finalTotalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button className="flex items-center justify-center gap-2 bg-[#0033A0] text-white px-6 py-3 rounded-lg hover:bg-[#002d8f] transition-colors">
                        <Download className="w-5 h-5" /><span>Download Ticket (PDF)</span>
                    </button>
                    <button onClick={() => navigate('/my-trips')} className="flex items-center justify-center gap-2 bg-white text-[#0033A0] border-2 border-[#0033A0] px-6 py-3 rounded-lg hover:bg-[#E8F1FF] transition-colors">
                        <span>Go to My Trips</span>
                    </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-900">
                            <p className="font-medium mb-1">Email Confirmation Sent</p>
                            <p>A confirmation email with your e-ticket has been sent to <span className="font-medium">{finalPassengerData.email}</span></p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2"><span className="text-[#0033A0]">•</span><span>Please arrive at the airport at least 2 hours before departure</span></li>
                        <li className="flex items-start gap-2"><span className="text-[#0033A0]">•</span><span>Carry a valid government-issued photo ID for domestic flights</span></li>
                        <li className="flex items-start gap-2"><span className="text-[#0033A0]">•</span><span>Web check-in opens 48 hours before departure</span></li>
                        <li className="flex items-start gap-2"><span className="text-[#0033A0]">•</span><span>Baggage allowance: 7 kg cabin + 15 kg check-in</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
