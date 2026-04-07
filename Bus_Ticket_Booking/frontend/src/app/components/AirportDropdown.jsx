import { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown, Search, X } from 'lucide-react';
import { getAirports } from '../../services/api.js';

export function AirportDropdown({ value, onChange, label, placeholder = 'Search city or airport...' }) {
    const [airports, setAirports] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Fetch airports on mount
    useEffect(() => {
        let mounted = true;
        async function fetchAirports() {
            setLoading(true);
            try {
                const data = await getAirports();
                if (mounted) setAirports(data);
            } catch {
                // Fallback list
                if (mounted) {
                    setAirports([
                        { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai' },
                        { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi' },
                        { code: 'BOM', name: 'Chhatrapati Shivaji International Airport', city: 'Mumbai' },
                        { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore' },
                        { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad' },
                        { code: 'CCU', name: 'Netaji Subhas Chandra Bose Airport', city: 'Kolkata' },
                        { code: 'GOI', name: 'Goa International Airport', city: 'Goa' },
                        { code: 'COK', name: 'Cochin International Airport', city: 'Kochi' },
                        { code: 'PNQ', name: 'Pune Airport', city: 'Pune' },
                        { code: 'AMD', name: 'Sardar Vallabhbhai Patel Airport', city: 'Ahmedabad' },
                        { code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur' },
                        { code: 'GAU', name: 'Lokpriya Gopinath Bordoloi Airport', city: 'Guwahati' },
                    ]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchAirports();
        return () => { mounted = false; };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearch('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = airports.filter((a) => {
        const term = search.toLowerCase();
        return (
            a.city.toLowerCase().includes(term) ||
            a.code.toLowerCase().includes(term) ||
            a.name.toLowerCase().includes(term)
        );
    });

    const selectedAirport = airports.find((a) => a.city === value);

    const handleSelect = (airport) => {
        onChange(airport.city);
        setIsOpen(false);
        setSearch('');
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange('');
        setSearch('');
    };

    return (
        <div className="group" ref={containerRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
                {label}
            </label>
            <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0033A0] transition-transform group-hover:scale-110 z-10" />

                {/* Trigger button */}
                <button
                    type="button"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen) setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    className={`w-full pl-12 pr-10 py-4 border-2 rounded-xl text-left transition-all font-medium cursor-pointer bg-white ${isOpen
                            ? 'border-[#0033A0] ring-2 ring-[#0033A0]/20'
                            : 'border-gray-200 hover:border-[#0033A0]'
                        }`}
                >
                    {selectedAirport ? (
                        <span className="text-gray-900">
                            {selectedAirport.city}{' '}
                            <span className="text-[#0033A0] font-bold">({selectedAirport.code})</span>
                        </span>
                    ) : (
                        <span className="text-gray-400">Select City</span>
                    )}
                </button>

                {/* Clear / Chevron */}
                {value ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                ) : (
                    <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Search input */}
                        <div className="p-3 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={placeholder}
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0033A0]/20 focus:border-[#0033A0] transition-all"
                                />
                            </div>
                        </div>

                        {/* Airport list */}
                        <div className="max-h-64 overflow-y-auto">
                            {loading ? (
                                <div className="px-4 py-8 text-center text-gray-400 text-sm">Loading airports...</div>
                            ) : filtered.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-400 text-sm">No airports found</div>
                            ) : (
                                filtered.map((airport) => (
                                    <button
                                        key={airport.code}
                                        type="button"
                                        onClick={() => handleSelect(airport)}
                                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#0033A0]/5 transition-colors text-left ${value === airport.city ? 'bg-[#0033A0]/5' : ''
                                            }`}
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#0033A0] to-[#0052CC] rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                                            {airport.code}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-gray-900 text-sm truncate">{airport.city}</div>
                                            <div className="text-xs text-gray-500 truncate">{airport.name}</div>
                                        </div>
                                        {value === airport.city && (
                                            <div className="ml-auto text-[#0033A0]">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
