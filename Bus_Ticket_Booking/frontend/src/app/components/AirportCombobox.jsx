import { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronsUpDown, Check, Search, Plane } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover.jsx';
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from './ui/command.jsx';
import { getAirports } from '../utils/api.js';

const FALLBACK_AIRPORTS = [
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
];

export function AirportCombobox({
    value,
    onChange,
    label,
    placeholder = 'Search city or airport...',
    variant = 'default', // 'default' | 'glass'
}) {
    const [open, setOpen] = useState(false);
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function fetchAirports() {
            setLoading(true);
            try {
                const data = await getAirports();
                if (mounted) setAirports(data);
            } catch {
                if (mounted) setAirports(FALLBACK_AIRPORTS);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchAirports();
        return () => { mounted = false; };
    }, []);

    const selectedAirport = airports.find((a) => a.city === value);

    const isGlass = variant === 'glass';

    return (
        <div>
            <label className={`block text-sm font-semibold mb-2 ${isGlass ? 'text-white/70' : 'text-gray-700'
                }`}>
                {label}
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        role="combobox"
                        aria-expanded={open}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer group ${isGlass
                            ? `bg-white/[0.08] border-white/[0.12] hover:bg-white/[0.14] ${open ? 'ring-2 ring-cyan-400/40 border-cyan-400/30' : ''
                            }`
                            : `bg-white border-gray-200 hover:border-indigo-400 shadow-sm ${open ? 'ring-2 ring-indigo-500/20 border-indigo-500' : ''
                            }`
                            }`}
                    >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isGlass
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'
                            }`}>
                            {selectedAirport ? (
                                <Plane className="w-4 h-4" />
                            ) : (
                                <MapPin className="w-4 h-4" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            {selectedAirport ? (
                                <div>
                                    <div className={`font-bold text-sm leading-tight ${isGlass ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {selectedAirport.city}
                                        <span className={`ml-1.5 text-xs font-semibold px-1.5 py-0.5 rounded ${isGlass ? 'bg-cyan-500/20 text-cyan-300' : 'bg-indigo-100 text-indigo-700'
                                            }`}>
                                            {selectedAirport.code}
                                        </span>
                                    </div>
                                    <div className={`text-xs truncate mt-0.5 ${isGlass ? 'text-white/40' : 'text-gray-500'
                                        }`}>
                                        {selectedAirport.name}
                                    </div>
                                </div>
                            ) : (
                                <span className={`text-sm ${isGlass ? 'text-white/40' : 'text-gray-400'
                                    }`}>
                                    Select City
                                </span>
                            )}
                        </div>
                        <ChevronsUpDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''
                            } ${isGlass ? 'text-white/30' : 'text-gray-400'}`} />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-gray-200 shadow-2xl overflow-hidden"
                    align="start"
                    sideOffset={6}
                >
                    <Command className="rounded-2xl">
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <CommandInput
                                placeholder={placeholder}
                                className="h-10 text-sm border-0 ring-0 focus:ring-0 outline-none"
                            />
                        </div>
                        <CommandList className="max-h-[280px] overflow-y-auto">
                            <CommandEmpty className="py-8 text-center">
                                <Plane className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">No airports found</p>
                            </CommandEmpty>
                            <CommandGroup>
                                {loading ? (
                                    <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        Loading airports...
                                    </div>
                                ) : (
                                    airports.map((airport) => (
                                        <CommandItem
                                            key={airport.code}
                                            value={`${airport.city} ${airport.code} ${airport.name}`}
                                            onSelect={() => {
                                                onChange(airport.city === value ? '' : airport.city);
                                                setOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-3 py-3 cursor-pointer rounded-xl mx-1 my-0.5 data-[selected=true]:bg-indigo-50"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                                                {airport.code}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm text-gray-900">{airport.city}</div>
                                                <div className="text-xs text-gray-500 truncate">{airport.name}</div>
                                            </div>
                                            {value === airport.city && (
                                                <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                            )}
                                        </CommandItem>
                                    ))
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
