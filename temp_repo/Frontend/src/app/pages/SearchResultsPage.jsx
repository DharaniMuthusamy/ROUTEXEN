import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ChevronRight, Plane, Clock, SlidersHorizontal, X } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback.jsx';
import { searchFlights, apiFlightToFrontend } from '../utils/api.js';

export function SearchResultsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchData = location.state || { from: 'Chennai', to: 'Delhi' };
    const [showFilters, setShowFilters] = useState(false);
    const [allFlights, setAllFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        priceRange: [0, 20000],
        nonStop: false,
        airlines: {},
    });

    // Fetch flights from backend API
    useEffect(() => {
        async function fetchFlights() {
            setLoading(true);
            setError(null);
            try {
                const from = searchData.from || 'Chennai';
                const to = searchData.to || 'Delhi';
                const date = searchData.departDate || new Date().toISOString().split('T')[0];
                const result = await searchFlights(from, to, date);
                const flights = result.flights.map(apiFlightToFrontend);
                setAllFlights(flights);

                // Initialize airline filters from actual results
                const airlineMap = {};
                flights.forEach(f => {
                    airlineMap[f.airline] = true;
                });
                setFilters(prev => ({ ...prev, airlines: airlineMap }));
            } catch (err) {
                setError(err.message || 'Failed to load flights');
                setAllFlights([]);
            } finally {
                setLoading(false);
            }
        }
        fetchFlights();
    }, [searchData.from, searchData.to, searchData.departDate]);

    const flightImages = [
        'https://images.unsplash.com/photo-1754481387410-7c8c9350372c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGFpcnBsYW5lJTIwYWlyY3JhZnQlMjByZW5kZXJ8ZW58MXx8fHwxNzcxODUyOTg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1627663412345-aad473f2ba39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwbGFuZSUyMGZseWluZyUyMHNreSUyMGNsb3Vkc3xlbnwxfHx8fDE3NzE4NTI5ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1717731879265-c5aabb7e6d15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXNzZW5nZXIlMjBhaXJwbGFuZSUyMHRha2VvZmZ8ZW58MXx8fHwxNzcxODUyOTkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1754481387410-7c8c9350372c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGFpcnBsYW5lJTIwYWlyY3JhZnQlMjByZW5kZXJ8ZW58MXx8fHwxNzcxODUyOTg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1627663412345-aad473f2ba39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwbGFuZSUyMGZseWluZyUyMHNreSUyMGNsb3Vkc3xlbnwxfHx8fDE3NzE4NTI5ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ];

    const filteredFlights = allFlights.filter(flight => {
        if (filters.nonStop && flight.stops > 0) return false;
        if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) return false;
        if (Object.keys(filters.airlines).length > 0) {
            if (filters.airlines[flight.airline] === false) return false;
        }
        return true;
    });

    const uniqueAirlines = [...new Set(allFlights.map(f => f.airline))];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#0033A0] font-medium">
                            {searchData.from} → {searchData.to}
                        </span>
                        {searchData.departDate && (
                            <>
                                <ChevronRight className="w-4 h-4" />
                                <span>{searchData.departDate}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                            {searchData.from} to {searchData.to}
                        </h1>
                        <p className="text-gray-600">
                            {loading ? (
                                <span>Searching flights...</span>
                            ) : (
                                <>
                                    <span className="font-semibold text-[#0033A0]">{filteredFlights.length}</span> flights available
                                </>
                            )}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filters</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-20">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                <button onClick={() => setShowFilters(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Maximum Price</label>
                                <input
                                    type="range" min="0" max="20000" step="500"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => setFilters({ ...filters, priceRange: [0, Number(e.target.value)] })}
                                    className="w-full accent-[#0033A0]"
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="text-sm text-gray-600">₹0</span>
                                    <span className="text-sm font-semibold text-[#0033A0]">₹{filters.priceRange[1].toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={filters.nonStop} onChange={(e) => setFilters({ ...filters, nonStop: e.target.checked })} className="w-4 h-4 rounded text-[#0033A0] focus:ring-[#0033A0] cursor-pointer" />
                                    <span className="text-sm font-medium text-gray-700">Non-stop flights only</span>
                                </label>
                            </div>

                            {uniqueAirlines.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Airlines</label>
                                    <div className="space-y-2">
                                        {uniqueAirlines.map((airline) => (
                                            <label key={airline} className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={filters.airlines[airline] !== false} onChange={(e) => setFilters({ ...filters, airlines: { ...filters.airlines, [airline]: e.target.checked } })} className="w-4 h-4 rounded text-[#0033A0] focus:ring-[#0033A0] cursor-pointer" />
                                                <span className="text-sm text-gray-700">{airline}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-3 space-y-4">
                        {loading && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                <div className="w-12 h-12 border-4 border-[#0033A0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Searching flights...</h3>
                                <p className="text-gray-600">Finding the best deals for you</p>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-12 text-center">
                                <Plane className="w-16 h-16 text-red-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
                                <p className="text-gray-600 mb-4">{error}</p>
                                <button onClick={() => navigate('/')} className="text-[#0033A0] hover:underline font-medium">Go back to search</button>
                            </div>
                        )}

                        {!loading && !error && filteredFlights.length === 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No flights found</h3>
                                <p className="text-gray-600">Try adjusting your filters or search for a different date</p>
                            </div>
                        )}

                        {!loading && !error && filteredFlights.map((flight, index) => (
                            <div key={flight.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden" onClick={() => navigate(`/flight/${flight.id}`, { state: { flight, searchData } })}>
                                <div className="flex">
                                    <div className="w-48 h-48 flex-shrink-0 relative overflow-hidden">
                                        <ImageWithFallback src={flightImages[index % flightImages.length]} alt={`${flight.airline} aircraft`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30" />
                                    </div>

                                    <div className="flex-1 p-6">
                                        <div className="flex items-center justify-between gap-6 flex-wrap">
                                            <div className="flex items-center gap-6 flex-1 min-w-0">
                                                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0033A0] to-[#0052CC] flex items-center justify-center text-white font-bold text-sm">{flight.logo}</div>
                                                    <span className="text-xs text-gray-500">{flight.airline}</span>
                                                </div>

                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-gray-900">{flight.departureTime}</div>
                                                        <div className="text-sm text-gray-600">{flight.departure}</div>
                                                    </div>

                                                    <div className="flex-1 flex flex-col items-center min-w-[100px]">
                                                        <div className="text-xs text-gray-500 mb-1">{flight.duration}</div>
                                                        <div className="w-full relative">
                                                            <div className="h-px bg-gray-300 w-full"></div>
                                                            <Plane className="w-4 h-4 text-[#0033A0] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {flight.stops === 0 ? (<span className="text-green-600 font-medium">Non-stop</span>) : (`${flight.stops} stop${flight.stops > 1 ? 's' : ''}`)}
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-gray-900">{flight.arrivalTime}</div>
                                                        <div className="text-sm text-gray-600">{flight.arrival}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                                <div className="text-3xl font-bold text-[#0033A0]">₹{flight.price.toLocaleString()}</div>
                                                <button onClick={(e) => { e.stopPropagation(); navigate(`/flight/${flight.id}`, { state: { flight, searchData } }); }} className="bg-gradient-to-r from-[#0033A0] to-[#0052CC] text-white px-8 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all">Select</button>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{flight.flightNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
