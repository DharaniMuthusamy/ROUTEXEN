import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Timer, CheckCircle2, AlertCircle, X, ArrowRight } from 'lucide-react';
import { getSeats, holdSeat, releaseSeat, getHoldStatus, getToken } from '../utils/api.js';

// ── SVG Seat Component ──────────────────────────────────────────────
function SeatIcon({ fill, stroke, label, isSelected }) {
    return (
        <svg viewBox="0 0 40 48" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Backrest */}
            <rect x="6" y="2" width="28" height="24" rx="6" ry="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
            {/* Seat cushion */}
            <rect x="6" y="24" width="28" height="14" rx="4" ry="4" fill={fill} stroke={stroke} strokeWidth="1.5" />
            {/* Left armrest */}
            <rect x="1" y="18" width="5" height="20" rx="2.5" fill={fill} stroke={stroke} strokeWidth="1.2" opacity="0.8" />
            {/* Right armrest */}
            <rect x="34" y="18" width="5" height="20" rx="2.5" fill={fill} stroke={stroke} strokeWidth="1.2" opacity="0.8" />
            {/* Label text */}
            {isSelected ? (
                <text x="20" y="22" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">✓</text>
            ) : (
                <text x="20" y="22" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">{label}</text>
            )}
        </svg>
    );
}

export function SeatSelectionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { flight: stateFlight, searchData, passengerData } = location.state || {};

    const mockFlight = {
        id: '1', airline: 'IndiGo', flightNumber: '6E-2043', departure: 'Chennai',
        arrival: 'Delhi', departureTime: '06:30', arrivalTime: '09:15',
        duration: '2h 45m', stops: 0, price: 4299,
    };

    const flight = stateFlight || mockFlight;

    // ── Feature B: Max seats = number of passengers ──
    const maxSeats = searchData?.passengers || parseInt(localStorage.getItem('passengerCount')) || 1;

    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [lockedSeats, setLockedSeats] = useState(new Set());
    const [bookedSeats, setBookedSeats] = useState(new Set());
    const [timeLeft, setTimeLeft] = useState(null);
    const [timerStarted, setTimerStarted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lockError, setLockError] = useState(null);
    const [releasing, setReleasing] = useState(null);  // seat being released
    const timerRef = useRef(null);
    const pollRef = useRef(null);

    // ── Fetch seats from API ─────────────────────────────────────────
    const fetchSeats = useCallback(async () => {
        try {
            const flightId = flight.id;
            const result = await getSeats(flightId);
            const booked = new Set();
            const locked = new Set();
            const seatList = result.seats.map((apiSeat) => {
                const seatNo = apiSeat.seat_no;
                const match = seatNo.match(/^(\d+)([A-Z])$/);
                let status = 'available';

                if (apiSeat.status === 'BOOKED') {
                    status = 'booked';
                    booked.add(seatNo);
                } else if (apiSeat.status === 'LOCKED') {
                    status = 'locked';
                    locked.add(seatNo);
                }

                if (!match) {
                    return { id: seatNo, row: 0, column: seatNo, status };
                }
                return { id: seatNo, row: parseInt(match[1]), column: match[2], status };
            });

            setSeats(seatList);
            setBookedSeats(booked);
            setLockedSeats(locked);
        } catch (err) {
            if (seats.length === 0) {
                setError(err.message || 'Failed to load seats');
                generateLocalSeats();
            }
        }
    }, [flight.id]);

    // ── Feature C: Sync timer from server hold-status ────────────────
    const syncHoldStatus = useCallback(async () => {
        try {
            const status = await getHoldStatus(Number(flight.id));
            if (status.remaining_seconds > 0 && status.held_seats.length > 0) {
                setTimeLeft(status.remaining_seconds);
                if (!timerStarted) setTimerStarted(true);
            } else if (status.held_seats.length === 0 && selectedSeats.length === 0) {
                // No holds left -> stop timer
                setTimerStarted(false);
                setTimeLeft(null);
            }
        } catch {
            // Silently fail — server timer sync is best-effort
        }
    }, [flight.id, timerStarted, selectedSeats.length]);

    // ── Initial fetch ─────────────────────────────────────────────────
    useEffect(() => {
        async function initialFetch() {
            setLoading(true);
            setError(null);
            await fetchSeats();
            setLoading(false);
        }
        initialFetch();
    }, [fetchSeats]);

    // ── Auto-refresh seats every 10 seconds ──────────────────────────
    useEffect(() => {
        pollRef.current = setInterval(() => {
            fetchSeats();
        }, 10000);
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, [fetchSeats]);

    function generateLocalSeats() {
        const rows = 30;
        const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
        const localSeats = [];
        for (let row = 1; row <= rows; row++) {
            for (const col of columns) {
                localSeats.push({ id: `${row}${col}`, row, column: col, status: 'available' });
            }
        }
        setSeats(localSeats);
    }

    // ── Countdown timer ──────────────────────────────────────────────
    useEffect(() => {
        if (timerStarted && timeLeft !== null && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev === null || prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        navigate('/search');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => { if (timerRef.current) clearInterval(timerRef.current); };
        }
    }, [timerStarted, navigate]);

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

    const allRows = [...new Set(seats.map(s => s.row))].sort((a, b) => a - b);

    // ── Handle seat click (Feature B: enforce max N) ─────────────────
    const handleSeatClick = async (seat) => {
        if (seat.status === 'booked' || seat.status === 'locked') return;
        setLockError(null);

        // ── Deselect (clicking already-selected seat) → release hold ──
        if (selectedSeats.includes(seat.id)) {
            await handleReleaseSeat(seat.id);
            return;
        }

        // ── Feature B: check max seat limit ──
        if (selectedSeats.length >= maxSeats) {
            setLockError(`You can select only ${maxSeats} seat${maxSeats > 1 ? 's' : ''} (${maxSeats} passenger${maxSeats > 1 ? 's' : ''}).`);
            return;
        }

        const token = getToken();
        if (!token) {
            setLockError('Please login first to select seats');
            return;
        }

        if (!timerStarted && selectedSeats.length === 0) {
            setTimerStarted(true);
            setTimeLeft(600);
        }

        // Optimistic update — show orange immediately
        setSelectedSeats(prev => [...prev, seat.id]);

        try {
            await holdSeat(Number(flight.id), seat.id, maxSeats);
            fetchSeats();
            syncHoldStatus(); // sync server timer
        } catch (err) {
            setSelectedSeats(prev => prev.filter(s => s !== seat.id));
            const detail = err?.detail || err?.message || `Seat ${seat.id} is already locked by another user`;
            setLockError(detail);
        }
    };

    // ── Feature C: Release a seat (❌ button) ─────────────────────────
    const handleReleaseSeat = async (seatId) => {
        setReleasing(seatId);
        setLockError(null);
        try {
            await releaseSeat(Number(flight.id), seatId);
            setSelectedSeats(prev => prev.filter(s => s !== seatId));
            await fetchSeats();
            await syncHoldStatus();

            // If no seats left, reset timer
            if (selectedSeats.length <= 1) {
                setTimerStarted(false);
                setTimeLeft(null);
                if (timerRef.current) clearInterval(timerRef.current);
            }
        } catch (err) {
            // Even if release API fails, remove from local state
            setSelectedSeats(prev => prev.filter(s => s !== seatId));
        } finally {
            setReleasing(null);
        }
    };



    // ── Seat colors: GREEN / ORANGE / RED ────────────────────────────
    const getSeatColors = (seat) => {
        if (seat.status === 'booked' || bookedSeats.has(seat.id)) {
            return { fill: '#ef4444', stroke: '#dc2626' }; // Red
        }
        if (selectedSeats.includes(seat.id)) {
            return { fill: '#f97316', stroke: '#ea580c' }; // Orange (selected)
        }
        if (seat.status === 'locked' || lockedSeats.has(seat.id)) {
            return { fill: '#fb923c', stroke: '#f97316' }; // Orange (held by others)
        }
        return { fill: '#22c55e', stroke: '#16a34a' }; // Green
    };

    const isSeatDisabled = (seat) => {
        return seat.status === 'booked' || (seat.status === 'locked' && !selectedSeats.includes(seat.id));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleConfirm = () => {
        if (selectedSeats.length === 0) { alert('Please select at least one seat'); return; }
        if (timerRef.current) clearInterval(timerRef.current);
        navigate('/payment', {
            state: {
                flight,
                searchData,
                passengerData,
                selectedSeats,
            },
        });
    };

    const isTimeRunningOut = timeLeft !== null && timeLeft <= 120;

    // ── Render seat button ───────────────────────────────────────────
    const renderSeat = (seat) => {
        const { fill, stroke } = getSeatColors(seat);
        const disabled = isSeatDisabled(seat);
        const isSelected = selectedSeats.includes(seat.id);
        const isAvailable = seat.status !== 'booked' && seat.status !== 'locked';

        return (
            <button
                key={seat.id}
                onClick={() => handleSeatClick(seat)}
                disabled={disabled}
                className={`w-11 h-14 relative transition-all duration-200 ${disabled ? 'cursor-not-allowed opacity-80' :
                    isSelected ? 'scale-105 drop-shadow-lg' :
                        isAvailable ? 'cursor-pointer hover:scale-110 hover:drop-shadow-md' : ''
                    }`}
                title={`Seat ${seat.id} — ${seat.status === 'booked' ? 'Booked' : seat.status === 'locked' ? 'Held' : isSelected ? 'Selected' : 'Available'}`}
                style={isSelected ? { animation: 'seatPulse 1.5s ease-in-out infinite' } : {}}
            >
                <SeatIcon fill={fill} stroke={stroke} label={seat.column} isSelected={isSelected} />
            </button>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {timerStarted && timeLeft !== null && (
                    <div className={`${isTimeRunningOut ? 'bg-red-100 border-red-300' : 'bg-amber-50 border-amber-200'} border-2 rounded-xl p-6 mb-6 flex items-center justify-between shadow-lg`}>
                        <div className="flex items-center gap-3">
                            <Timer className={`w-8 h-8 ${isTimeRunningOut ? 'text-red-600' : 'text-amber-600'}`} />
                            <div>
                                <div className={`font-semibold ${isTimeRunningOut ? 'text-red-900' : 'text-amber-900'}`}>{isTimeRunningOut ? '⚠️ Hurry! Time running out' : 'Complete booking within'}</div>
                                <div className={`text-sm ${isTimeRunningOut ? 'text-red-700' : 'text-amber-700'}`}>Seats are held for 10 minutes</div>
                            </div>
                        </div>
                        <div className={`text-4xl font-bold ${isTimeRunningOut ? 'text-red-600' : 'text-amber-600'}`}>{formatTime(timeLeft)}</div>
                    </div>
                )}

                {lockError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                        <span className="text-red-700 text-sm">{lockError}</span>
                        <button onClick={() => setLockError(null)} className="ml-auto text-red-400 hover:text-red-600 text-lg font-bold">×</button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                            {/* ── Feature B: Passenger count badge ── */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">Select Your Seat</h2>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm">
                                    <span className="text-blue-700 font-medium">👤 {maxSeats} Passenger{maxSeats > 1 ? 's' : ''}</span>
                                    <span className="text-blue-500 ml-2">• {selectedSeats.length}/{maxSeats} selected</span>
                                </div>
                            </div>

                            {loading && (
                                <div className="text-center py-12">
                                    <div className="w-12 h-12 border-4 border-[#0033A0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading seat map...</p>
                                </div>
                            )}

                            {!loading && error && (
                                <div className="text-center py-8">
                                    <p className="text-amber-600 mb-2">⚠️ {error}</p>
                                    <p className="text-sm text-gray-500">Using offline seat map</p>
                                </div>
                            )}

                            {!loading && (
                                <>
                                    {/* Legend */}
                                    <div className="flex items-center gap-8 mb-8 pb-6 border-b border-gray-200 flex-wrap">
                                        {[
                                            { fill: '#22c55e', stroke: '#16a34a', label: 'Available' },
                                            { fill: '#f97316', stroke: '#ea580c', label: 'Selected / Held' },
                                            { fill: '#ef4444', stroke: '#dc2626', label: 'Booked' },
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-center gap-2">
                                                <div className="w-8 h-10">
                                                    <SeatIcon fill={item.fill} stroke={item.stroke} label="" isSelected={false} />
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-center mb-6">
                                        <div className="bg-gradient-to-r from-[#0033A0] to-[#0052CC] text-white px-8 py-2 rounded-full text-sm font-semibold shadow-lg">✈️ Front of Aircraft</div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <div className="inline-block min-w-full">
                                            {/* Column headers */}
                                            <div className="flex justify-center mb-3">
                                                <div className="flex gap-1.5 items-center">
                                                    <div className="w-10"></div>
                                                    {['A', 'B', 'C'].map((col) => (<div key={col} className="w-11 text-center text-sm font-bold text-[#0033A0]">{col}</div>))}
                                                    <div className="w-10"></div>
                                                    {['D', 'E', 'F'].map((col) => (<div key={col} className="w-11 text-center text-sm font-bold text-[#0033A0]">{col}</div>))}
                                                    <div className="w-10"></div>
                                                </div>
                                            </div>

                                            {/* Seat rows */}
                                            <div className="space-y-1">
                                                {allRows.map((row) => (
                                                    <div key={row} className="flex justify-center items-center gap-1.5">
                                                        <div className="w-10 text-sm font-bold text-gray-500 text-right pr-1">{row}</div>
                                                        <div className="flex gap-1.5">
                                                            {['A', 'B', 'C'].map(col => {
                                                                const seat = seats.find(s => s.row === row && s.column === col);
                                                                return seat ? renderSeat(seat) : (<div key={`${row}${col}`} className="w-11 h-14"></div>);
                                                            })}
                                                        </div>
                                                        <div className="w-10 flex items-center justify-center">
                                                            <div className="h-px w-6 bg-gray-300"></div>
                                                        </div>
                                                        <div className="flex gap-1.5">
                                                            {['D', 'E', 'F'].map(col => {
                                                                const seat = seats.find(s => s.row === row && s.column === col);
                                                                return seat ? renderSeat(seat) : (<div key={`${row}${col}`} className="w-11 h-14"></div>);
                                                            })}
                                                        </div>
                                                        <div className="w-10 text-sm font-bold text-gray-500 pl-1">{row}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── Right sidebar: Selected seats + Skip button ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-20">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Seats</h3>

                            {selectedSeats.length === 0 ? (
                                <p className="text-sm text-gray-600 mb-6">No seats selected</p>
                            ) : (
                                <div className="mb-6">
                                    {/* ── Feature C: Seat chips with ❌ close button ── */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {selectedSeats.map((seatId) => (
                                            <div key={seatId} className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-1.5 group">
                                                <span>{seatId}</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleReleaseSeat(seatId); }}
                                                    disabled={releasing === seatId}
                                                    className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all opacity-70 group-hover:opacity-100"
                                                    title={`Remove seat ${seatId}`}
                                                >
                                                    {releasing === seatId ? (
                                                        <div className="w-3 h-3 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <X className="w-3 h-3" />
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-sm text-gray-600">{selectedSeats.length}/{maxSeats} seat{maxSeats > 1 ? 's' : ''} selected</div>
                                </div>
                            )}

                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-sm"><span className="text-gray-600">Flight Fare</span><span className="font-medium text-gray-900">₹{flight.price.toLocaleString()}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-600">Seat Charges</span><span className="font-medium text-gray-900">₹{(selectedSeats.length * 200).toLocaleString()}</span></div>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-bold text-[#0033A0]">₹{(flight.price + selectedSeats.length * 200).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Confirm seats button */}
                            <button
                                onClick={handleConfirm}
                                disabled={selectedSeats.length === 0}
                                className="w-full bg-gradient-to-r from-[#0033A0] to-[#0052CC] text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {selectedSeats.length > 0 ? (
                                    <>Confirm {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} <ArrowRight className="w-5 h-5" /></>
                                ) : 'Select Seats to Continue'}
                            </button>


                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes seatPulse {
                    0%, 100% { transform: scale(1.05); }
                    50% { transform: scale(1.1); }
                }
            `}</style>
        </div>
    );
}
